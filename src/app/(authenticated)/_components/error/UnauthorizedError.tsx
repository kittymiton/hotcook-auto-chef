import { errorCodeMap } from '@/lib/constants/errorCodeMap';
import { Button } from '../../../../components/ui/Button';

// 認証できない場合のエラー表示
export const UnauthorizedError = () => {
  return (
    <div className="p-6">
      <p className="text-red-600">{errorCodeMap.UNAUTHORIZED}</p>
      <div className="mt-6">
        <Button href="/" variant="action-navigation">
          <span>TOPに戻る</span>
        </Button>
      </div>
    </div>
  );
};
