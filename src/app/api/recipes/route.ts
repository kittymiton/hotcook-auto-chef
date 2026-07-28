import { createErrorResponse } from '@/lib/apiServer/createErrorResponse';
import { requireUserId } from '@/lib/apiServer/requireUserId';
import { numberSchema } from '@/lib/schema/numberSchema';
import { recipeSummaryListSchema } from '@/lib/schema/recipeSchema';
import { prisma } from '@/lib/utils/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const userId = await requireUserId(request);
    if (!userId) {
      return createErrorResponse('UNAUTHORIZED', 401);
    }

    const { searchParams } = new URL(request.url);
    const takeParam = searchParams.get('take');
    const take = takeParam ? numberSchema.parse(takeParam) : undefined;

    const recipes = await prisma.recipe.findMany({
      where: { createdByUser: userId },
      select: {
        id: true,
        title: true,
        point: true,
        talkRoomId: true,
        tags: {
          select: {
            recipeTag: {
              select: {
                tag: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take,
    });

    const formattedRecipes = recipes.map((recipe) => {
      // レシピ単体はtag[]にしたレシピに作り変える
      const recipeTags = recipe.tags.map((relation) => {
        return relation.recipeTag.tag;
      });

      return { ...recipe, tags: recipeTags };
    });

    const parsedRecipes = recipeSummaryListSchema.parse(formattedRecipes);

    return NextResponse.json(parsedRecipes); // 0件(データ未保存）でも正常（空配列で返す）
  } catch (e) {
    if (e instanceof ZodError) {
      console.error('[Recipes API] GET Validation failed', e);
      return createErrorResponse('INVALID_FORMAT', 400);
    }
    console.error('[Recipes API] GET Unexpected error', e);
    return createErrorResponse('INTERNAL_SERVER_ERROR', 500);
  }
}
