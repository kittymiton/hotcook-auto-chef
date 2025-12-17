/**
 * ユーザーのメッセージを/api/talksに送信し、DBに保存するためのユーティリティ関数
 * UIへの返り値は不要
 * @param content - 保存するメッセージ本文
 * @param talkRoomId - 対象トークルームID
 * @param sender- ユーザー or AI
 * @param token - 認証用JWT
 * @returns {Promise<void>} 完了を示すPromise（データは返さない）
 * @throws API通信に失敗した場合
 */
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function sendTalks(
  content: string,
  talkRoomId: number,
  sender: 'user' | 'chef',
  token: string
): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/api/talks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ content, sender, talkRoomId }),
    });

    if (!res.ok) {
      const text = await res.text(); // .textでサーバーが返すbodyを文字列で受け取る
      throw new Error(text);
    }
  } catch (err) {
    console.error('Error sending user content:', err);
    throw err;
  }
}
