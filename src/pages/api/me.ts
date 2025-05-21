import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/db';
import { verify } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'dev_secret_key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ user: null });
  }
  try {
    const decoded = verify(token, SECRET_KEY) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        // Add more fields as needed
      },
    });
    if (!user) return res.status(404).json({ user: null });
    return res.status(200).json({ user });
  } catch (e) {
    return res.status(401).json({ user: null });
  }
}
