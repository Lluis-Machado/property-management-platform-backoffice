// Libraries imports
import { Barlow } from 'next/font/google';

export const barlow = Barlow({
    weight: ['400', '600', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    variable: '--font-barlow',
});
