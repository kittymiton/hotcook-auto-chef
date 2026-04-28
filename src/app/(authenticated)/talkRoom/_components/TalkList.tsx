import type { ChatMessageList } from '@/lib/schema/chatSchema';
import { TalkItem } from '@authenticated/talkRoom/components/TalkItem';
import { useLayoutEffect, useRef } from 'react';

type Props = {
  talks: ChatMessageList;
};

export const TalkList = ({ talks }: Props) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!talks?.length) return;

    let raf1 = 0;
    let raf2 = 0;
    let raf3 = 0;
    let cleanedUp = false;

    const scrollToBottom = () => {
      if (cleanedUp) return; // 新しいrafを優先し、前回のrafを止める

      const viewPort = scrollRef.current;
      if (!viewPort) return;
      viewPort.scrollTop = viewPort.scrollHeight - viewPort.clientHeight;
    };

    // レイアウト確定まで3フレーム追従し、スクロールが上に戻るバグを防ぐ
    raf1 = requestAnimationFrame(() => {
      scrollToBottom();
      raf2 = requestAnimationFrame(() => {
        scrollToBottom();
        raf3 = requestAnimationFrame(() => {
          scrollToBottom();
        });
      });
    });

    return () => {
      // 画像等読み込みの重いレイアウトシフトでrafの遅延実行を止め、干渉を防ぐ
      cleanedUp = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      cancelAnimationFrame(raf3);
    };
  }, [talks]);

  return (
    <div ref={scrollRef} className="flex flex-col overflow-y-auto flex-1 p-4">
      {talks
        .slice()
        .reverse()
        .map((talk) => (
          <TalkItem key={talk.id} talk={talk} />
        ))}
    </div>
  );
};
