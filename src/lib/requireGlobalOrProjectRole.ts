// lib/auth/requireGlobalOrProjectRole.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from './getUserFromRequest';
import { prisma } from '@/lib/prisma';
import { Role, ProjectRole } from '@prisma/client';

export async function requireGlobalOrProjectRole(
  req: NextRequest,
  projectId: string,
  globalRoles: Role[],
  projectRoles: ProjectRole[]
): Promise<{ authorized: boolean; response?: NextResponse; userId?: string }> {
  const user = await getUserFromRequest(req);

  if (!user) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  // Check global role
  if (globalRoles.includes(user.role as Role)) {
    return { authorized: true, userId: user.userId };
  }

  // Check project role
  const membership = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: user.userId,
        projectId,
      },
    },
  });

  if (!membership || !projectRoles.includes(membership.role)) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  return { authorized: true, userId: user.userId };
}
