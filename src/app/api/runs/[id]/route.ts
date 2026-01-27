import { NextRequest, NextResponse } from 'next/server';
import { getRun } from '@/lib/oaxe/runStore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const run = await getRun(id);

    if (!run) {
      return NextResponse.json(
        { error: 'Run not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(run);
  } catch (error) {
    console.error('Error getting run:', error);
    return NextResponse.json(
      { error: 'Failed to get run' },
      { status: 500 }
    );
  }
}
