import { memo } from 'react';
import Image from 'next/image';

import './loading.css';
import wufLogo from '@/public/WuF_Logo.png';

const Loading = ({ isLoading }: { isLoading: boolean }): React.ReactElement => (
    <>
        {isLoading && (
            <div className='absolute inset-0 z-10 flex items-center justify-center bg-slate-300'>
                <Image
                    className='loader-animation w-[25vw]'
                    src={wufLogo}
                    alt='Loading Image'
                />
            </div>
        )}
    </>
);

export default memo(Loading);
