// Local imports
import { ApiCallError } from '@/lib/utils/errors';
import { Archive, Folder } from '@/lib/types/documentsAPI';
import { DocumentsFilesWrapper } from '@/components/pages/documents/files/DocumentsFilesWrapper';

const page = async (): Promise<React.ReactElement> => {

  const documentsUrl = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/documents`;

  const getArchivesBase = async (): Promise<TreeItem<Archive>[]> => {
    const resp = await fetch(`${documentsUrl}/archives`, { cache: 'no-cache' })
    if (!resp.ok) throw new ApiCallError('Error while getting archives');
    const archivesResp: Archive[] = await resp.json();

    return archivesResp.map(archive => ({
      data: { ...archive },
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
    const archiveIds = archivesBase.map(archive => archive.id);

    const foldersResponses = await Promise.all(
      archiveIds.map(archiveId => fetch(`${documentsUrl}/${archiveId}/folders`, { cache: 'no-cache' }))
    );

    const transformFoldersToTreeItems = (folders: Folder[]): TreeItem<Folder>[] => {
      const stack: { folder: Folder; treeItem: TreeItem<Folder> }[] = [];
      const result: TreeItem<Folder>[] = [];

      for (const folder of folders) {
        const treeItem: TreeItem<Folder> = {
          data: folder,
          disabled: false,
          expanded: false,
          hasItems: folder.childFolders.length > 0,
          id: folder.id,
          items: [],
          parentId: folder.parentId,
          selected: false,
          text: folder.name,
          visible: true,
        };

        if (folder.childFolders.length > 0) {
          stack.push({ folder, treeItem });
        };

        result.push(treeItem);

        while (stack.length > 0) {
          const { folder, treeItem } = stack.pop()!;

          treeItem.items = folder.childFolders.map((childFolder) => {
            const childTreeItem: TreeItem<Folder> = {
              data: childFolder,
              disabled: false,
              expanded: false,
              hasItems: childFolder.childFolders.length > 0,
              id: childFolder.id,
              items: [],
              parentId: childFolder.parentId,
              selected: false,
              text: childFolder.name,
              visible: true,
            };

            if (childFolder.childFolders.length > 0) {
              stack.push({ folder: childFolder, treeItem: childTreeItem });
            };

            return childTreeItem;
          });
        };
      };

      return result;
    };

    const archives = await Promise.all(
      foldersResponses.map(async (response, index) => {
        if (!response.ok) throw new ApiCallError(`Error while getting archive {${archiveIds[index]}} folders`);
        const data: Folder[] = await response.json();
        const items = transformFoldersToTreeItems(data);

        return {
          ...archivesBase[index],
          hasItems: items.length > 0,
          items,
        };
      })
    );

    return archives;
  };

  return (
    <DocumentsFilesWrapper archives={await getArchives()} />
  );
};

export default page;