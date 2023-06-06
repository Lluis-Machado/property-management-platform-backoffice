// React imports
import { MouseEvent, useState } from 'react';

// Libraries imports
import { faChevronRight, faFolderClosed, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';

// Local imports
import { Tree } from './Tree';


export interface ITreeNode {
    key: string;
    label: string;
    children?: ITreeNode[];
}

interface Props {
    node: ITreeNode;
    onFolderClick: (id: string) => void;
}

export const TreeNode = ({ node, onFolderClick }: Props): JSX.Element => {
    const { children } = node;

    const [showChildren, setShowChildren] = useState(false);

    const handleClickArrow = (e: MouseEvent) => {
        setShowChildren(p => !p);
    };

    const handleClickItem = (e: MouseEvent) => {
        const { target }: { target: any } = e;
        if (e.detail % 2 == 0) { // open / close on double click
            setShowChildren(p => !p);
        }
        onFolderClick(target.parentElement.parentElement.id);
    }

    const childrenIncludeFolders = (children: ITreeNode[]) => children.some(child => child.children) ?? false;

    return (
        <>
            <div
                id={node.key}
                tabIndex={1}
                className='
                    flex flex-row items-center gap-2 cursor-pointer select-none                    
                    hover:bg-secondary-200/25 focus:bg-secondary-500/20
                    '
            >
                <div className='w-4 h-4 flex items-center justify-center' onClick={handleClickArrow}>
                    {
                        children && childrenIncludeFolders(children) &&
                        <motion.div
                            initial={{
                                rotate: 0,
                                color: showChildren ? '#b99f6c' : '#274158',
                            }}
                            animate={{
                                rotate: showChildren ? 90 : 0,
                                color: showChildren ? '#b99f6c' : '#274158',
                                transition: {
                                    rotate: { type: 'spring' },
                                    color: { duration: .2 },
                                },
                            }}
                            whileHover={{
                                color: '#b99f6c',
                                transition: { duration: .2 },
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faChevronRight}
                            />
                        </motion.div>
                    }
                </div>
                <div className='flex flex-row items-center gap-2' onClick={handleClickItem}>
                    <div className='w-4 h-4 flex items-center justify-center text-secondary-500'>
                        <FontAwesomeIcon icon={showChildren ? faFolderOpen : faFolderClosed} />
                    </div>
                    <span className='text-secondary-500'>
                        {node.label}
                    </span>
                </div>
            </div>
            <ul className='ml-4'>
                {showChildren && children && children.length > 0 && <Tree treeData={children} onFolderClick={onFolderClick} />}
            </ul>
        </>
    );
}