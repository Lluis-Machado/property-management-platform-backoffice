// Local imports
import { ITreeNode, TreeNode } from './TreeNode';

interface PropsTree {
    treeData: ITreeNode[];
    onFolderClick: (id: string) => void;
}

export const Tree = ({ treeData, onFolderClick }: PropsTree): JSX.Element => (
    <ul className='whitespace-nowrap max-w-[220px]'>
        {treeData.map((node) => (
            node.children &&
            <TreeNode node={node} onFolderClick={onFolderClick} key={node.key} />
        ))}
    </ul>
);
