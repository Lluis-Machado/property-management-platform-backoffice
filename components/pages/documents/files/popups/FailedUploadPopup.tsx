//React imports
import { useCallback, useRef } from 'react';

// Libraries imports
import { faCircleXmark, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popup from 'devextreme-react/popup';

interface Props {
    files: { fileName: string, status: number }[];
    onHidden: () => void;
    onShown: () => void;
    visible: boolean;
};

const FailedUploadPopup = ({ files, onHidden, onShown, visible }: Props): React.ReactElement => {

    const PopupRef = useRef<Popup>(null);

    const ContentRender = useCallback(() => (
        <div className='flex flex-col gap-2'>
            <h2 className='mb-4'>
                {`The following file${files.length > 1 ? 's' : ''} have failed:`}
            </h2>
            <div>
                {
                    files.map(({ fileName }) => (
                        <p key={fileName}>
                            {fileName}
                        </p>
                    ))
                }
            </div>
        </div>
    ), [files]);

    const TitleRender = useCallback(() => (
        <div className='flex flex-row text-lg justify-between text-red-400'>
            <div className='flex flex-row gap-4 items-center text-center'>
                <FontAwesomeIcon icon={faCircleXmark} />
                <h2>{`${files.length} failed upload${files.length > 1 ? 's' : ''}`}</h2>
            </div>
            <FontAwesomeIcon
                icon={faXmark}
                className='hover:bg-slate-100 rounded-sm cursor-pointer p-2'
                onClick={() => PopupRef.current?.instance.hide()}
            />
        </div>
    ), [files.length]);

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

export default FailedUploadPopup;