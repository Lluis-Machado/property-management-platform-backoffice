'use client';

// React imports
import { FC, memo } from 'react';

// Libraries imports
import { easeInOut, motion } from 'framer-motion';
import { Route } from '@/lib/types/route';

interface Props {
    route: Route;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const SidebarTooltip: FC<Props> = memo(function SidebarTooltip({
    onMouseEnter,
    onMouseLeave,
    route,
}) {
    return (
        <motion.div
            className='absolute flex h-header cursor-default flex-row items-center text-custom-white'
            initial={{
                left: 40,
                opacity: 0,
            }}
            animate={{
                left: 60,
                opacity: 1,
                transition: {
                    duration: 0.3,
                    ease: easeInOut,
                },
            }}
            exit={{
                opacity: 0,
                transition: {
                    duration: 0.3,
                    ease: easeInOut,
                },
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className='h-5 w-5 rotate-45 bg-secondary-500' />
            <div
                className={`
                            absolute left-1 select-none whitespace-nowrap rounded-lg 
                            bg-secondary-500 px-4 py-1 text-center
                        `}
            >
                {route.name}
            </div>
        </motion.div>
    );
});

export default SidebarTooltip;
