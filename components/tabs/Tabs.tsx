// React imports
import { useCallback, useEffect, useRef, useState } from 'react';

// Libraries imports
import { motion } from 'framer-motion';

// Local imports
import { sizeType } from '@/lib/types/sizeType';
import { Tab } from '@/lib/types/tab';
import TabButton from './Tab';
import TabPanel from './TabPanel';

interface Props {
    /**
     * Array of tabs to include on the component
     */
    dataSource: Tab[];
    /**
     * Size of the component
     */
    size?: sizeType;
}

export default function Tabs({
    dataSource,
    size = 'base'
}: Props) {

    const wrapperRef = useRef<HTMLUListElement>(null);

    const [tabs, setTabs] = useState<Tab[]>([]);
    const [tabSelected, setTabSelected] = useState({
        currentTab: dataSource.length ? 1 : 0,
        noTabs: dataSource.length,
    })

    const handleKeyDown = useCallback((e: { keyCode: number; target: any }): void => {
        if (e.keyCode === 39) {
            if (wrapperRef.current && wrapperRef.current?.contains(e.target)) {
                if (
                    tabSelected.currentTab >= 1 &&
                    tabSelected.currentTab < tabSelected.noTabs
                ) {
                    setTabSelected({
                        ...tabSelected,
                        currentTab: tabSelected.currentTab + 1,
                    })
                } else {
                    setTabSelected({
                        ...tabSelected,
                        currentTab: 1,
                    })
                }
            }
        }

        if (e.keyCode === 37) {
            if (wrapperRef.current && wrapperRef.current.contains(e.target)) {
                if (
                    tabSelected.currentTab > 1 &&
                    tabSelected.currentTab <= tabSelected.noTabs
                ) {
                    setTabSelected({
                        ...tabSelected,
                        currentTab: tabSelected.currentTab - 1,
                    })
                } else {
                    setTabSelected({
                        ...tabSelected,
                        currentTab: tabSelected.noTabs,
                    })
                }
            }
        }
    }, [tabSelected]);

    useEffect(() => {
        if (dataSource) {
            const tabs = dataSource.map((item, idx) => ({
                children: item.children,
                icon: item.icon,
                index: idx,
                panelId: `${item.title}-panel`,
                tabId: `${item.title}-tab`,
                title: item.title,
                totalTabs: dataSource.length,
            }));
            setTabs(tabs);
        }
    }, [dataSource]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    return (
        <section className='max-w-full'>
            <motion.ul
                layout
                className='flex items-center border-b border-slate-200'
                role='tablist'
                ref={wrapperRef}
            >
                {
                    tabs?.map(tab =>
                        <TabButton
                            key={tab.title}
                            setTabSelected={setTabSelected}
                            size={size}
                            tab={tab}
                            tabSelected={tabSelected}
                        />
                    )
                }
            </motion.ul>
            <motion.div layout>
                {
                    tabs?.map(tab =>
                        <TabPanel
                            key={tab.title}
                            setTabSelected={setTabSelected}
                            size={size}
                            tab={tab}
                            tabSelected={tabSelected}
                        />
                    )
                }
            </motion.div>
        </section>
    )
}