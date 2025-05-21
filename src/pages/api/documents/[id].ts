import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid document ID' });
  }

  try {
    if (req.method === 'GET') {
      const document = await prisma.document.findUnique({
        where: { id },
        include: {
          transactions: {
            include: {
              category: true
            }
          }
        }
      });

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      return res.status(200).json({ document });
    }
    
    // Handle other methods
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error fetching document:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
