//React imports
import { FC, memo, useCallback, useRef } from 'react';

// Libraries imports
import { faCircleXmark, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popup from 'devextreme-react/popup';

export type failedDocumentsType =
    | 'download'
    | 'upload'
    | 'move'
    | 'copy'
    | 'delete';

interface Props {
    files: { fileName?: string; name?: string; status: number }[];
    onHidden: () => void;
    onShown: () => void;
    type: failedDocumentsType;
    visible: boolean;
}

const FailedUploadPopup: FC<Props> = memo(function FailedUploadPopup({
    files,
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
                    {`The following file${
                        files.length > 1 ? 's have' : ' has'
                    } failed:`}
                </h2>
                <div>
                    {files.map(({ fileName, name }) => (
                        <p key={fileName || name}>{fileName || name}</p>
                    ))}
                </div>
            </div>
        ),
        [files]
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
                    <h2>{`${files.length} failed ${
                        files.length > 1 ? plural[type] : type
                    }`}</h2>
                </div>
                <FontAwesomeIcon
                    icon={faXmark}
                    className='cursor-pointer rounded-sm p-2 hover:bg-slate-100'
                    onClick={() => PopupRef.current?.instance.hide()}
                />
            </div>
        );
    }, [files.length, type]);

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

export default FailedUploadPopup;
