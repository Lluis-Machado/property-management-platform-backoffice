// Libraries imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';

// Local imports
import { sizeType } from '@/lib/types/sizeType';
import { Tab } from '@/lib/types/tab';

interface Props {
    setTabSelected: React.Dispatch<React.SetStateAction<{
        currentTab: number;
        noTabs: number;
    }>>,
    size: sizeType;
    tab: Tab,
    tabSelected: {
        currentTab: number;
        noTabs: number;
    }
}

const getTabButtonSize = (size: sizeType): string => {
    const sizes = {
        large: 'h-12 px-6 text-sm',
        base: ' h-10 px-5 text-sm',
        small: 'h-8  px-4 text-xs'
    }
    return sizes[size];
}

const getTabSpanSize = (size: sizeType): string => {
    const sizes = {
        large: 'only:-mx-6',
        base: ' only:-mx-5',
        small: 'only:-mx-4'
    }
    return sizes[size];
}

export default function TabButton({ setTabSelected, size, tab, tabSelected }: Props) {
    const { icon, title, index, panelId, tabId } = tab;
    if (index == undefined) return <></>;
    const indexAux = index + 1;
    return (
        <motion.li
            layout
            role='presentation'
        >
            <button
                className={`
                    -mb-px inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-t border-b-2 font-medium 
                    tracking-wide transition duration-300 focus-visible:outline-none disabled:cursor-not-allowed 
                    hover:bg-primary-50 hover:stroke-primary-600 focus:bg-primary-50
                    ${getTabButtonSize(size)}
                    ${tabSelected.currentTab === indexAux
                        ? `border-primary-500 stroke-primary-500 text-primary-500 hover:border-primary-600  hover:text-primary-600
                           focus:border-primary-700 focus:stroke-primary-700 focus:text-primary-700 disabled:border-slate-500`
                        : `justify-self-center border-transparent stroke-slate-700 text-slate-700 hover:border-primary-500 hover:text-primary-500
                         focus:border-primary-600 focus:stroke-primary-600 focus:text-primary-600 disabled:text-slate-500`
                    }
                `}
                id={tabId}
                role='tab'
                aria-setsize={tabSelected.noTabs}
                aria-posinset={indexAux}
                tabIndex={tabSelected.currentTab === indexAux ? 0 : -1}
                aria-controls={panelId}
                aria-selected={tabSelected.currentTab === indexAux ? true : false}
                onClick={() => setTabSelected({ ...tabSelected, currentTab: indexAux })}
            >
                <span className='order-2'>{title}</span>
                <span className={`relative ${getTabSpanSize(size)}`}>
                    <FontAwesomeIcon icon={icon} className={'w-6 h-6'} />
                </span>
            </button>
        </motion.li>
    )
}