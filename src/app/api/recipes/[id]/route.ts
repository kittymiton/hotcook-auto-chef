import { requireUserId } from '@/lib/apiServer/requireUserId';
import { prisma } from '@/lib/utils/prisma';
import { numberSchema } from '@/lib/validators/numberSchema';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const recipeId = numberSchema.parse(params.id);

    const recipe = await prisma.recipe.findFirst({
      where: { id: recipeId, createdByUser: userId }, //recipeIdで、createdByUserがuserId
      select: {
        id: true,
        title: true,
        point: true,
        cookingTime: true,
        ingredients: true,
        instructions: true,
        imageKey: true,
        createdAt: true,
      },
    });

    if (!recipe) {
      return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: 'INVALID_REQUEST' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}
