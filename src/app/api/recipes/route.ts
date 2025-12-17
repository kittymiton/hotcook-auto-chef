import { getDbUserIdFromToken } from '@/lib/apiServer/auth';
import { prisma } from '@/lib/utils/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * レシピ一覧（aside用）を取得するAPIハンドラー
 * 指定されたクエリパラメータ（?take=5）に応じて、レシピのサマリー一覧を返す
 * @param request - Next.jsのリクエストオブジェクト
 * @returns {Promise<NextResponse<any>>} レシピ一覧を含むJSONレスポンス
 */
export const GET = async (request: NextRequest) => {
  try {
    const userId = await getDbUserIdFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: '認証に失敗しました' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const takeParam = searchParams.get('take');
    const take = takeParam ? Number(takeParam) : undefined; // 全件取得はtakeパラメータを送らない

    const recipes = await prisma.recipe.findMany({
      where: {
        createdByUser: userId,
      },
      select: {
        id: true,
        title: true,
        cookingTime: true,
      },
      orderBy: {
        createdAt: 'desc', // 降順
      },
      take,
    });
    return NextResponse.json(recipes);
  } catch (err) {
    console.error('レシピ一覧取得エラー:', err);
    return NextResponse.json(
      { message: 'サーバーの応答がありません' },
      { status: 500 }
    );
  }
};
