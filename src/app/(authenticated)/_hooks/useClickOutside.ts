import { useEffect } from 'react';

type UseClickOutsideArgs = {
  ref: React.RefObject<HTMLElement>;
  onClose: () => void;
  isActive: boolean;
};

export const useClickOutside = ({
  ref,
  onClose,
  isActive,
}: UseClickOutsideArgs) => {
  useEffect(() => {
    if (!isActive) return;

    const handleClick = (e: PointerEvent) => {
      const target = e.target;

      if (!(target instanceof Node)) return;
      if (!ref.current) return;

      if (!ref.current.contains(target)) {
        onClose();
      }
    };

    document.addEventListener('pointerdown', handleClick);

    return () => {
      document.removeEventListener('pointerdown', handleClick);
    };
  }, [ref, onClose, isActive]);
};
