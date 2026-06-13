import { ErrorCode } from '@/lib/schema/errorSchema';

// APIから返るアプリ独自errorCodeを、UI表示用メッセージに変換
export const errorCodeMap: Record<ErrorCode, string> = {
  //INVALID_FORMAT: '料理名や食材を教えてください', TODO: 料理名・食材入力の不足は専用errorCodeへ切り出す
  INVALID_FORMAT: '入力内容を確認してください',
  INVALID_ID: '不正なURLです',
  UNAUTHORIZED: 'ログインが必要です',
  FORBIDDEN: '現在この機能は利用できません。設定をご確認ください',
  TALK_NOT_FOUND: 'トークが見つかりません',
  RECIPE_NOT_FOUND: 'レシピが見つかりません',
  NOT_FOUND: '存在しません。',
  QUOTA_EXCEEDED: '利用上限に達しました',
  NETWORK_ERROR: '通信エラーが発生しました。ネット接続を確認してください',
  AI_ERROR: 'ただいま混み合っています。少し時間をおいて再度お試しください',
  INTERNAL_SERVER_ERROR: 'エラーが発生しました',
  DEFAULT: 'システムエラーが発生しました。時間を置いてお試しください',
  UNKNOWN_ERROR: '見つかりません',
};
