//React imports
import { memo, useCallback, useRef } from 'react';

// Libraries imports
import { faCircleXmark, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popup from 'devextreme-react/popup';
import { Document, DocumentUpload } from '@/lib/types/documentsAPI';

/**
 * Represents the type of failed documents.
 */
export type failedDocumentsType =
    | 'download'
    | 'upload'
    | 'move'
    | 'copy'
    | 'delete';

export interface Props {
    /**
     * An array of `Document` or `DocumentUpload` objects representing the failed documents.
     */
    documents: Document[] | DocumentUpload[];
    /**
     * Callback function to be executed when the popup is hidden.
     */
    onHidden: () => void;
    /**
     * Callback function to be executed when the popup is shown.
     */
    onShown: () => void;
    /**
     * The type of failed documents. Can be one of 'download', 'upload', 'move', 'copy', or 'delete'.
     */
    type: failedDocumentsType;
    /**
     * Specifies whether the popup is visible or not.
     */
    visible: boolean;
}

/**
 * Returns the name of the given Document or DocumentUpload.
 *
 * @param document - The `Document` or `DocumentUpload` object for which to get the name.
 * @returns The name of the document if it is a `Document` object, otherwise the fileName of the `DocumentUpload` object.
 */
const getDocumentName = (document: Document | DocumentUpload) => {
    const isDocumentUpload = (
        document: Document | DocumentUpload
    ): document is DocumentUpload => document?.hasOwnProperty('fileName');
    return isDocumentUpload(document) ? document.fileName : document.name;
};

/**
 * Represents a warning popup that displays the documents that have failed the given action (type).
 */
const FailedDocumentPopup = ({
    documents,
    onHidden,
    onShown,
    type,
    visible,
}: Props) => {
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
};

export default memo(FailedDocumentPopup);
