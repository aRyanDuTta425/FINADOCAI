import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', [
    `token=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict`
  ]);
  res.status(200).json({ success: true });
}
