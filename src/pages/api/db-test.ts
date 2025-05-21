import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test database connection by running a simple query
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      },
      take: 5 // Limit to 5 records for safety
    });
    
    // Return success response with user data
    return res.status(200).json({ 
      message: 'Database connection successful',
      users,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection test error:', error);
    let errObj: { name?: string; message?: string; stack?: string } = {};
    if (error instanceof Error) {
      errObj = {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      };
    } else {
      errObj = { name: typeof error, message: JSON.stringify(error) };
    }
    // Return detailed error information
    return res.status(500).json({ 
      message: 'Database connection test failed',
      error: errObj,
      timestamp: new Date().toISOString()
    });
  }
}
