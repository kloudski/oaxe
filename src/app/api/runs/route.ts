import { NextRequest, NextResponse } from 'next/server';
import { createRun, listRuns } from '@/lib/oaxe/runStore';
import { executePlan } from '@/lib/oaxe/planner';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { directive } = body;

    if (!directive || typeof directive !== 'string') {
      return NextResponse.json(
        { error: 'Directive is required' },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    const run = await createRun(id, directive.trim());

    // Start generation async (don't await)
    executePlan(id).catch(console.error);

    return NextResponse.json(run, { status: 201 });
  } catch (error) {
    console.error('Error creating run:', error);
    return NextResponse.json(
      { error: 'Failed to create run' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const runs = await listRuns();
    return NextResponse.json(runs);
  } catch (error) {
    console.error('Error listing runs:', error);
    return NextResponse.json(
      { error: 'Failed to list runs' },
      { status: 500 }
    );
  }
}
