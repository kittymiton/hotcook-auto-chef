import { userRoomSchema } from '@auth/lib/validation/userRoomSchema';
import { Loading } from '@authenticated/components/Loading';
import { useAuthedSWR } from '@authenticated/hooks/useAuthedSWR';
import Image from 'next/image';
import { ReactNode } from 'react';
import { Button } from '../../../../../components/ui/Button';

type Props = {
  children?: ReactNode;
};

export const SideNav = ({ children }: Props) => {
  const {
    data: userRoom,
    isLoading,
    error,
  } = useAuthedSWR('/api/userRoom', userRoomSchema);

  if (isLoading) return <Loading />;

  const talkRoomId = userRoom?.talkRoom.id;

  // NOTE: talkRoomIdを取得できなかった場合のみ、失敗表示（ログイン済み前提、未ログイン状態は上位で認証ガード済）
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
            <div className="flex w-[24px] shrink-0 justify-center">
              <Image
                src="/icons/system/chat.svg"
                alt=""
                aria-hidden="true"
                width={18}
                height={18}
                className="size-[18px] shrink-0"
              />
            </div>
            <span>Chat</span>
          </Button>
        </li>
        <li>
          <Button href="/mypage" variant="side-mypage">
            <div className="flex w-[24px] shrink-0 justify-center">
              <Image
                src="/icons/system/account.svg"
                alt=""
                aria-hidden="true"
                width={22}
                height={22}
                className="h-auto shrink-0"
              />
            </div>
            <span>MYページ</span>
          </Button>
        </li>
        <li>
          <Button href="/recipes" variant="side-my-recipes">
            <div className="flex w-[24px] shrink-0 justify-center">
              <Image
                src="/icons/system/recipe.svg"
                alt=""
                aria-hidden="true"
                width={15}
                height={15}
                className="size-[15px] shrink-0"
              />
            </div>
            <span>MYレシピ</span>
          </Button>
        </li>
      </ul>
      {children}
    </nav>
  );
};
