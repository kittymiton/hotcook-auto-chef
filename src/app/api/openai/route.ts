import { createHotcookRecipe } from '@/lib/apiServer/createHotCookRecipe';
import { sendTalks } from '@/lib/talks/sendTalks';
import { filterInput } from '@/lib/validators/filterInput';
import { NextResponse } from 'next/server';

/**
 * OpenAIへのリクエストを仲介するPOST APIエンドポイント
 * - クライアントから受け取った入力を前処理（バリデーション・整形）した上でOpenAI APIに送信
 * - OpenAIからの応答をクライアントに返却
 * @param request - HTTP POSTリクエスト（JSONボディ）
 * @returns {Promise<NextResponse>} OpenAI応答を含むレスポンス
 */
export async function POST(request: Request): Promise<NextResponse<any>> {
  try {
    // 1. tokenチェック（共通処理）
    const token = request.headers.get('Authorization') ?? '';
    if (!token) {
      return NextResponse.json(
        { error: '認証トークンがありません' },
        { status: 401 }
      );
    }

    // 2. request body抽出
    const { content, talkRoomId, recentMessages } = await request.json();

    // 3. ユーザー入力のみ安全チェック
    const inputError = filterInput(content);
    if (inputError) {
      return NextResponse.json({ error: inputError }, { status: 400 });
    }

    // 4. ユーザー入力をtalkDBに保存
    await sendTalks(content, talkRoomId, 'user', token);

    // 5. OpenAIへ（改行を消さない）
    const { content: chefContent } = await createHotcookRecipe({
      content,
      recentMessages,
    });

    // 6. AI返答をtalkDBに保存
    await sendTalks(chefContent, talkRoomId, 'chef', token);

    return NextResponse.json({ ok: true }); // フロント側へ返信を返すために必要
  } catch (err) {
    console.error('通信エラー:', err);
    return NextResponse.json(
      { error: 'AIからの応答が空です' },
      { status: 500 }
    );
  }
}
