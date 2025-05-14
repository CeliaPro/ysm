import { NextRequest, NextResponse } from 'next/server';
import * as userService from '@/services/userService';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
      const { email, password, name } = await req.json();
  
      // Basic validation
      if (!email || !password || !name) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }
  
      // Check if the user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 409 });
      }
  
      // Hash the password
      const hashedPassword = await hash(password, 10);
  
      // Create the user
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: 'EMPLOYEE', // default role (optional)
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          createdAt: true,
        },
      });
  
      return NextResponse.json(newUser, { status: 201 });
    } catch (error: any) {
      console.error('Registration error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }