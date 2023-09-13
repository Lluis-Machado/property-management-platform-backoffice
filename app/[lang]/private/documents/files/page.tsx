// Local imports
import { ApiCallError } from '@/lib/utils/errors';
import { Archive, Folder } from '@/lib/types/documentsAPI';
import { DocumentsFilesWrapper } from '@/components/pages/documents/files/DocumentsFilesWrapper';
import { getTreeItemFolderFromFolder } from '@/lib/utils/documents/utilsDocuments';
import { TreeItem } from '@/lib/types/treeView';

const page = async (): Promise<React.ReactElement> => {
    const documentsUrl = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/documents`;

    const getArchivesBase = async (): Promise<TreeItem<Archive>[]> => {
        const resp = await fetch(`${documentsUrl}/archives`, {
            cache: 'no-store',
        });
        if (!resp.ok) throw new ApiCallError('Error while getting archives');
        const archivesResp: Archive[] = await resp.json();

        return archivesResp.map((archive) => ({
            data: archive,
            disabled: false,
            expanded: false,
            hasItems: false,
            id: archive.id,
            items: [],
            parentId: null,
            selected: false,
            text: archive.name,
            visible: true,
        }));
    };

    const getArchives = async (): Promise<TreeItem<Archive>[]> => {
        const archivesBase = await getArchivesBase();
        const archiveIds = archivesBase.map((archive) => archive.id);

        const foldersResponses = await Promise.all(
            archiveIds.map((archiveId) =>
                fetch(`${documentsUrl}/${archiveId}/folders`, {
                    cache: 'no-store',
                })
            )
        );

        const archives: TreeItem<Archive>[] = await Promise.all(
            foldersResponses.map(async (response, index) => {
                if (!response.ok)
                    throw new ApiCallError(
                        `Error while getting archive {${archiveIds[index]}} folders`
                    );
                const data: Folder[] = await response.json();
                const items = data.map(getTreeItemFolderFromFolder);

                return {
                    ...archivesBase[index],
                    hasItems: items.length > 0,
                    items,
                };
            })
        );

        return archives;
    };

    return <DocumentsFilesWrapper archives={await getArchives()} />;
};

export default page;
