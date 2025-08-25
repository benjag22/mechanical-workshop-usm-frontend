import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export const cn = (...inputs: string[]) => {
    return twMerge(clsx(inputs));
};
