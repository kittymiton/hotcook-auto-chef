import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  // clsxでクラス名を結合、twMergeで競合するTailwindクラスを整理（後に指定した方を優先）
  return twMerge(clsx(inputs));
}
