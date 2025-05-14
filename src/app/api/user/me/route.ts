// GET /api/users/me to get the current user
import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/getUserFromRequest';

export async function GET(req: NextRequest) {
  try {
    const { userId: userId } = await getUserFromRequest(req);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) return new NextResponse('User not found', { status: 404 });
    return NextResponse.json(user);
  } catch {
    return new NextResponse('Unauthorized', { status: 401 });
  }
}
