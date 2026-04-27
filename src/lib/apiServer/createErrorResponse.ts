import { ErrorCode } from '@/lib/schema/errorSchema';
import { NextResponse } from 'next/server';

export const createErrorResponse = (error: ErrorCode, status: number) => {
  return NextResponse.json({ error }, { status });
};
