import { type ErrorCode } from '@/lib/schema/errorSchema';

// 複数ErrorCodeをまとめてnull除外する関数
export const filterErrorCodes = (
  ...code: (ErrorCode | null)[]
): ErrorCode[] => {
  // 片方のみエラー時に混ざるnullだけを除外
  const filteredErrorCodes = code.filter((code) => code !== null);
  return filteredErrorCodes;
};
