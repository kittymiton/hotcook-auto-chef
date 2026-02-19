import { requireUserId } from '@/lib/apiServer/requireUserId';
import { prisma } from '@/lib/utils/prisma';
import { numberSchema } from '@/lib/validators/numberSchema';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const userId = await requireUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const takeParam = searchParams.get('take');
    const take = takeParam ? numberSchema.parse(takeParam) : undefined;

    const recipes = await prisma.recipe.findMany({
      where: { createdByUser: userId },
      select: {
        id: true,
        title: true,
        cookingTime: true,
      },
      orderBy: { createdAt: 'desc' },
      take,
    });

    return NextResponse.json(recipes);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
