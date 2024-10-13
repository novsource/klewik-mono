import {twMerge} from 'tailwind-merge';
import {clsx, ClassValue} from 'clsx';

export const cn = (...classValues: ClassValue[]) => {
  return twMerge(clsx(...classValues));
};
