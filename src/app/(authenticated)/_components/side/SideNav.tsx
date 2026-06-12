import { userRoomSchema } from '@auth/lib/validation/userRoomSchema';
import { Loading } from '@authenticated/components/Loading';
import { useAuthedSWR } from '@authenticated/hooks/useAuthedSWR';
import { ReactNode } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Icon } from '../../../../components/ui/Icon';
import { IconWrapper } from '../../../../components/ui/IconWrapper';

type Props = {
  children?: ReactNode;
};

// NOTE: ログイン後画面で共通利用するサイドナビ
// SideAreaはサイドバー外枠、SideNavは共通ナビ本体。childrenには画面ごとの追加要素を渡す。
export const SideNav = ({ children }: Props) => {
  const {
    data: userRoom,
    isLoading,
    error,
  } = useAuthedSWR('/api/userRoom', userRoomSchema);

  const talkRoomId = userRoom?.talkRoom.id;

  // NOTE: userRoom取得中のundefinedを失敗扱いにしない
  if (isLoading || !userRoom) {
    return <Loading />;
  }

  // 認証済み前提でroomIdを取得できなかった場合のみ失敗表示
  if (error || !talkRoomId) {
    return (
      <nav>
        <p className="pt-4">ナビを表示できませんでした</p>
      </nav>
    );
  }

  return (
    <nav>
      <ul className="mb-8 flex flex-col gap-4 pt-4">
        <li>
          <Button href={`/talkRoom/${talkRoomId}`} variant="side-chat">
            <IconWrapper>
              <Icon
                src="/icons/system/chat.svg"
                width={18}
                height={18}
                className="size-[18px]"
              />
            </IconWrapper>
            <span>Chat</span>
          </Button>
        </li>
        <li>
          <Button href="/mypage" variant="side-mypage">
            <IconWrapper>
              <Icon
                src="/icons/system/account.svg"
                width={22}
                height={22}
                className="h-auto"
              />
            </IconWrapper>
            <span>MYページ</span>
          </Button>
        </li>
        <li>
          <Button href="/recipes" variant="side-my-recipes">
            <IconWrapper>
              <Icon
                src="/icons/system/recipe.svg"
                width={15}
                height={15}
                className="size-[15px]"
              />
            </IconWrapper>
            <span>MYレシピ</span>
          </Button>
        </li>
      </ul>
      {children}
    </nav>
  );
};
