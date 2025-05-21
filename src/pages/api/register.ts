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

  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  try {
    console.log('Registering user with email:', email);
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }
    // Save password in name field for demo (since schema has no password field)
    const user = await prisma.user.create({
      data: { email, name: password },
    });
    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    
    // Set token in HTTP-only cookie
    res.setHeader('Set-Cookie', serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60, // 1 hour
      sameSite: 'strict',
      path: '/',
    }));
    
    return res.status(201).json({ token });
  } catch (e) {
    console.error('Registration error:', e);
    let errObj: { name?: string; message?: string; stack?: string } = {};
    if (e instanceof Error) {
      if (e.name === 'PrismaClientInitializationError') {
        return res.status(500).json({
          message: 'Database connection error. Please try again later.',
          error: e.message
        });
      }
      // Handle unique constraint violation separately
      // @ts-ignore
      if (e.code === 'P2002' && e.meta?.target?.includes('email')) {
        return res.status(409).json({
          message: 'User already exists with this email',
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
    return res.status(500).json({ message: 'Registration failed', error: errObj });
  }
}
