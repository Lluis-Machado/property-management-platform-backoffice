// Libraries imports
import {
    faDatabase,
    faMagnifyingGlass,
    faSliders,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tabs } from 'pg-components';

// Local imports
import { Archive, Document, Folder } from '@/lib/types/documentsAPI';
import { downloadDocument } from '@/lib/utils/documents/apiDocuments';
import { FileActions } from './FileActions';
import { FileMetaData } from './FileMetaData';
import { isArchive } from '@/lib/utils/documents/utilsDocuments';
import { useEffect, useState } from 'react';

interface Props {
    className: string;
    onFileDetailsClosed: () => void;
    selectedDocument: Document | undefined;
    selectedFolder: Archive | Folder | undefined;
}

async function getDocumentUrl(
    selectedFolder: Archive | Folder | undefined,
    selectedDocument: Document | undefined
) {
    if (!selectedFolder || !selectedDocument) return '';
    const { id } = selectedDocument;
    const archiveId = isArchive(selectedFolder)
        ? selectedFolder.id
        : (selectedFolder as Folder).archiveId;
    return URL.createObjectURL(await downloadDocument(archiveId, id));
}

export const DetailsWrapper = ({
    className,
    onFileDetailsClosed,
    selectedDocument,
    selectedFolder,
}: Props) => {
    const [documentUrl, setDocumentUrl] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            const url = await getDocumentUrl(selectedFolder, selectedDocument);
            setDocumentUrl(url);
        };

        fetchData();
    }, [selectedFolder, selectedDocument]);

    return (
        <div className={`flex h-full flex-col ${className} relative`}>
            <Tabs
                size='large'
                dataSource={[
                    {
                        icon: faMagnifyingGlass,
                        title: 'Preview',
                        children: (
                            <iframe
                                className='h-full w-full'
                                src={documentUrl}
                            />
                        ),
                    },
                    {
                        icon: faSliders,
                        title: 'Actions',
                        children: <FileActions />,
                    },
                    {
                        icon: faDatabase,
                        title: 'Metadata',
                        children: <FileMetaData document={selectedDocument} />,
                    },
                ]}
            />
            <div
                className='absolute right-0 top-0 flex h-12 w-12 items-center justify-center'
                onClick={onFileDetailsClosed}
            >
                <div className='flex h-3/4 w-3/4 cursor-pointer items-center justify-center rounded-md text-secondary-500 transition-colors hover:bg-secondary-200/20 hover:text-primary-600'>
                    <FontAwesomeIcon icon={faXmark} />
                </div>
            </div>
        </div>
    );
};
