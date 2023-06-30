// React imports
import { FC, memo } from 'react';

// Libraries imports
import { easeInOut, motion } from 'framer-motion';
import { Route } from '@/lib/types/route';

interface Props {
    route: Route;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
};

const SidebarTooltip: FC<Props> = memo(function SidebarTooltip({ onMouseEnter, onMouseLeave, route }) {
    return (
        <motion.div
            className='absolute h-header flex flex-row items-center cursor-default text-custom-white'
            initial={{
                left: 40,
                opacity: 0,
            }}
            animate={{
                left: 60,
                opacity: 1,
                transition: {
                    duration: .3,
                    ease: easeInOut
                }
            }}
            exit={{
                opacity: 0,
                transition: {
                    duration: .3,
                    ease: easeInOut
                }
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className='w-5 h-5 bg-secondary-500 rotate-45' />
            <div className={`
                            absolute left-1 text-center whitespace-nowrap px-4 
                            py-1 bg-secondary-500 rounded-lg select-none
                        `}
            >
                {route.name}
            </div>
        </motion.div>
    );
});

export default SidebarTooltip;