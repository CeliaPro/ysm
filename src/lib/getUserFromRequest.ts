import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Define the correct type for the token
type UserFromToken = {
  userId: string; // If userId is a string, change this accordingly
  role: 'ADMIN' | 'PROJECT_MANAGER' | 'EMPLOYEE';
};

export const getUserFromRequest = async (req: NextRequest): Promise<UserFromToken> => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    throw new Error('Authorization header missing');
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // Ensure the payload contains userId and role as expected
    if (!decoded.userId || !decoded.role) {
      throw new Error('Token payload invalid');
    }

    return {
      userId: decoded.userId,  // Ensure this matches what you destructure later
      role: decoded.role,
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid or expired token');
  }
};
