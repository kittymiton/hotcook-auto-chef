import { errorCodeMap } from '@/lib/constants/errorCodeMap';
import type { ErrorCode } from '@/lib/schema/errorSchema';

type Props = {
  errorCodes: ErrorCode[];
};

// 取得エラー表示
export const DisplayErrorMessage = ({ errorCodes }: Props) => {
  // 同一errorCodeのエラー表示重複を除く
  const uniqueCodes = [...new Set(errorCodes)];
  return (
    <ul>
      {uniqueCodes.map((errorCode) => (
        <li key={errorCode} className="mb-1 text-red-600">
          {errorCodeMap[errorCode]}
        </li>
      ))}
    </ul>
  );
};
