import { createErrorResponse } from '@/lib/apiServer/createErrorResponse';
import { requireUserId } from '@/lib/apiServer/requireUserId';
import { numberSchema } from '@/lib/schema/numberSchema';
import { prisma } from '@/lib/utils/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireUserId(request);
    if (!userId) {
      return createErrorResponse('UNAUTHORIZED', 401);
    }

    const recipeId = numberSchema.parse(params.id);

    const recipe = await prisma.recipe.findFirst({
      where: { id: recipeId, createdByUser: userId },
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
      return createErrorResponse('RECIPE_NOT_FOUND', 404);
    }

    return NextResponse.json(recipe);
  } catch (e) {
    if (e instanceof ZodError) {
      console.error('[Recipe API] GET Validation failed', e);
      return createErrorResponse('INVALID_FORMAT', 400);
    }
    console.error('[Recipe API] GET Unexpected error', e);
    return createErrorResponse('INTERNAL_SERVER_ERROR', 500);
  }
}
