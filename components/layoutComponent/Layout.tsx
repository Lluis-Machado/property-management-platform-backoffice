// React imports
import { useCallback } from 'react';

// lLibraries imports
import { motion } from 'framer-motion';

export type LayoutColsAmount = 1 | 2 | 3 | 4 | 6;

interface Props {
    children: React.ReactNode;
    className?: string;
    cols?: LayoutColsAmount;
};

const getItemSpan = (cols: LayoutColsAmount): string => {
    const spans: Record<LayoutColsAmount, string> = {
        1: 'md:col-span-8 lg:col-span-12',
        2: 'lg:col-span-6',
        3: '',
        4: 'lg:col-span-3',
        6: 'lg:col-span-2',
    }
    return `col-span-4 ${spans[cols]}`;
};

export const Layout = ({ children, className = '', cols = 2 }: Props): React.ReactElement => {

    const renderChild = useCallback((child: React.ReactNode, key: number) => (
        <motion.div layout='position' className={getItemSpan(cols)} key={key}>
            {child}
        </motion.div>
    ), [cols]);

    return (
        <section className={className}>
            <motion.div layout className='grid grid-cols-4 gap-2 md:grid-cols-8 lg:grid-cols-12'>
                {
                    children instanceof Array
                        ? children.map(renderChild)
                        : renderChild(children, 0)
                }
            </motion.div>
        </section>
    );
};

export default Layout;