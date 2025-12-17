import { prisma } from '@/lib/utils/prisma';
/**
 * アプリのヘルスチェック用API
 * - DB接続が正常か確認するためにprisma.user.count()を実行
 * - エラーがなければ{ ok: true }を返す
 * @returns {Promise<Response>} JSONレスポンス
 */
export async function GET() {
  try {
    await prisma.user.count(); // DBを起こす
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false });
  }
}
