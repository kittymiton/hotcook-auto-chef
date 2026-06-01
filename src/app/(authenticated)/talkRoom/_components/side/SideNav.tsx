import Image from 'next/image';
import { ReactNode } from 'react';
import { Button } from '../../../../../components/ui/Button';

type Props = {
  talkRoomId: number;
  children: ReactNode;
};

export const SideNav = ({ talkRoomId, children }: Props) => {
  return (
    <nav>
      <ul className="mb-8 flex flex-col gap-4">
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
