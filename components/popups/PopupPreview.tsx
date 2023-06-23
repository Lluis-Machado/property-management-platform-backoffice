// React imports
import { memo, useCallback } from 'react';

// Libraries imports
import { Button } from 'pg-components';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Popup as DxPopup, Position } from 'devextreme-react/popup';

interface PopupHeaderProps {
    title: string;
    onClose: () => void;
};

const HeaderPopup = ({ title, onClose }: PopupHeaderProps): React.ReactElement => (
    <div className='flex justify-between'>
        <div className='flex font-bold text-2xl text-secondary-500 justify-center items-center'>
            {title}
        </div>
        <div className='w-12'>
            <Button icon={faXmark} size={'base'} onClick={onClose} style={'outline'} />
        </div>
    </div>
);

interface PopupProps {
    fileURL: string;
    isVisible: boolean;
    onClose: () => void;
    title: string;
};

const PopupPreview = ({ fileURL, isVisible, onClose, title }: PopupProps): React.ReactElement => {

    const contentRender = useCallback(() => <iframe className='w-full h-full' src={`${fileURL}#view=Fit`} />, [fileURL]);

    const titleComponent = useCallback(() => <HeaderPopup title={title} onClose={onClose} />, [title, onClose]);

    return (
        <DxPopup
            contentRender={contentRender}
            dragEnabled={false}
            height={'80vh'}             
            hideOnOutsideClick={true}
            onHiding={onClose}
            titleComponent={titleComponent}
            visible={isVisible}
            width={'80vw'}
        >
            <Position of='#content' />
        </DxPopup>
    )
};

export default memo(PopupPreview);