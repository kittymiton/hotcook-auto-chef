import { cn } from '@/lib/utils/cn';
import Image from 'next/image';

type Props = {
  src: string;
  width: number;
  height: number;
  className?: string;
};

export const Icon = ({ src, width, height, className }: Props) => {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      width={width}
      height={height}
      className={cn('shrink-0', className)}
    />
  );
};
