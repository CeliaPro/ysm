// src/app/api/projects/route.ts

import { NextRequest, NextResponse } from 'next/server';
import * as projectService from '@/services/projectService';
import { getUserFromRequest } from '@/lib/getUserFromRequest';

// GET all projects for current user (based on membership)
export async function GET(req: NextRequest) {
  try {
    const { userId } = await getUserFromRequest(req);
    const projects = await projectService.getUserProjects(userId);
    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

// POST create a new project (ADMIN or MANAGER only)
export async function POST(req: NextRequest) {
  try {
    const { userId, role } = await getUserFromRequest(req);

    if (role !== 'ADMIN' && role !== 'PROJECT_MANAGER') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const data = await req.json();
    const project = await projectService.createProject(data);
    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: 'Error creating project' }, { status: 500 });
  }
}
