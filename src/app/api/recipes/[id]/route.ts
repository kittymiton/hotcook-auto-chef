import { getDbUserIdFromToken } from '@/lib/apiServer/auth';
import { prisma } from '@/lib/utils/prisma';
import { NextResponse } from 'next/server';

/**
 * 指定されたレシピIDの詳細情報を返すGET API
 * - リクエストに含まれる認証トークンからユーザーIDを取得し、未認証の場合401を返す
 * - params.idを数値に変換し、そのIDに対応するレシピをDBから取得
 * - レシピが存在しない場合は404を返す
 * - 成功時はレシピ詳細データをJSONとして返す
 * @param request - HTTP GETリクエスト（認証トークンを含む）
 * @param params.id - 取得対象のレシピID（URLの動的セグメント／文字列）
 * @returns {Promise<NextResponse>} レシピ詳細のJSONレスポンス
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getDbUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: '認証に失敗しました' },
        { status: 401 }
      );
    }

    const recipeId = Number(params.id);
    const recipe = await prisma.recipe.findUnique({
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
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    return NextResponse.json({ recipe });
  } catch (err) {
    console.error('レシピ詳細取得エラー:', err);
    return NextResponse.json(
      { error: 'サーバーの応答がありません' },
      { status: 500 }
    );
  }
}
