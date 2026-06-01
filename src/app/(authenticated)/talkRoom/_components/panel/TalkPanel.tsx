import { ChatMessageList } from '@/lib/schema/chatSchema';
import { TalkList } from '@authenticated/talkRoom/components/talks/TalkList';

import { useLayoutEffect, useRef } from 'react';

type Props = {
  talks: ChatMessageList;
  children: React.ReactNode;
};

// スクロールエリア（TalkPanel全体）配置の設定
export const TalkPanel = ({ talks, children }: Props) => {
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

  // Form周辺でもスクロールできるよう、TalkListとFormを同じスクロール領域に置く
  return (
    <section
      ref={scrollRef}
      className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-l-3xl bg-gray-steel"
    >
      <TalkList talks={talks} />

      <div className="sticky bottom-0 z-10 bg-gray-steel">{children}</div>
    </section>
  );
};
