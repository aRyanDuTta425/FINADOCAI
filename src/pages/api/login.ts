import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
// Use the consistent DB client approach
import prisma from '../../lib/db';

const SECRET_KEY = process.env.JWT_SECRET || 'dev_secret_key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  try {
    // Password is stored in the name field for demo
    console.log('Looking for user with email:', email);
    const user = await prisma.user.findUnique({ where: { email } });
    console.log('User found:', user);
    if (!user || user.name !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    
    // Set token in HTTP-only cookie
    res.setHeader('Set-Cookie', serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60, // 1 hour
      sameSite: 'strict',
      path: '/',
    }));
    
    return res.status(200).json({ token });
  } catch (e) {
    console.error('Login error:', e);
    let errObj: { name?: string; message?: string; stack?: string } = {};
    if (e instanceof Error) {
      if (e.name === 'PrismaClientInitializationError') {
        return res.status(500).json({
          message: 'Database connection error. Please try again later.',
          error: e.message
        });
      }
      errObj = {
        name: e.name,
        message: e.message,
        stack: process.env.NODE_ENV === 'development' ? e.stack : undefined
      };
    } else {
      errObj = { name: typeof e, message: JSON.stringify(e) };
    }
    return res.status(500).json({ message: 'Login failed', error: errObj });
  }
}
