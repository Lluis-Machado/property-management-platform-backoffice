'use client'

// Libraries imports
import { AnimatePresence, motion } from 'framer-motion';

const Loading = ({ isLoading }: { isLoading: boolean }): JSX.Element => (
    <AnimatePresence>
        {isLoading && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.5, ease: 'easeIn' } }}
                exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeOut' } }}
                className='flex items-center absolute inset-0 z-10 bg-slate-300'
            >
                <motion.img
                    className=''
                    src='./WuF_Logo.png'
                    alt="Loading Image"
                    initial={{ opacity: 0, scale: .2 }}
                    animate={{ opacity: 1, transition: { duration: 1, repeat: Infinity, repeatType: 'reverse' } }}
                />
            </motion.div>
        )}
    </AnimatePresence>
);

export default Loading;
