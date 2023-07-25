//React imports
import { FC, memo, useCallback, useRef } from 'react';

// Libraries imports
import { faCircleXmark, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popup from 'devextreme-react/popup';
import { Document, DocumentUpload } from '@/lib/types/documentsAPI';

export type failedDocumentsType =
    | 'download'
    | 'upload'
    | 'move'
    | 'copy'
    | 'delete';

interface Props {
    documents: Document[] | DocumentUpload[];
    onHidden: () => void;
    onShown: () => void;
    type: failedDocumentsType;
    visible: boolean;
}

const getDocumentName = (document: Document | DocumentUpload) => {
    const isDocumentUpload = (
        document: Document | DocumentUpload
    ): document is DocumentUpload => !document?.hasOwnProperty('fileName');
    return isDocumentUpload(document) ? document.fileName : document.name;
};

const FailedDocumentPopup: FC<Props> = memo(function FailedUploadPopup({
    documents,
    onHidden,
    onShown,
    type,
    visible,
}): React.ReactElement {
    const PopupRef = useRef<Popup>(null);

    const ContentRender = useCallback(
        () => (
            <div className='flex flex-col gap-2'>
                <h2 className='mb-4'>
                    {`The following document${
                        documents.length > 1 ? 's have' : ' has'
                    } failed:`}
                </h2>
                <div>
                    {documents.map((document) => (
                        <p key={getDocumentName(document)}>
                            {getDocumentName(document)}
                        </p>
                    ))}
                </div>
            </div>
        ),
        [documents]
    );

    const TitleRender = useCallback(() => {
        const plural = {
            download: 'downloads',
            upload: 'uploads',
            move: 'moves',
            copy: 'copies',
            delete: 'deletions',
        };
        return (
            <div className='flex flex-row justify-between text-lg text-red-400'>
                <div className='flex flex-row items-center gap-4 text-center'>
                    <FontAwesomeIcon icon={faCircleXmark} />
                    <h2>{`${documents.length} failed ${
                        documents.length > 1 ? plural[type] : type
                    }`}</h2>
                </div>
                <FontAwesomeIcon
                    icon={faXmark}
                    className='cursor-pointer rounded-sm p-2 hover:bg-slate-100'
                    onClick={() => PopupRef.current?.instance.hide()}
                />
            </div>
        );
    }, [documents.length, type]);

    return (
        <Popup
            container='#content'
            contentRender={ContentRender}
            dragEnabled={false}
            height='auto'
            hideOnOutsideClick
            onHidden={onHidden}
            onShown={onShown}
            ref={PopupRef}
            titleRender={TitleRender}
            visible={visible}
            width='80vw'
        />
    );
});

export default FailedDocumentPopup;
