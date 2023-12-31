// React imports
import { memo, useCallback } from 'react';

// Libraries imports
import { Button } from 'pg-components';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Popup as DxPopup, Position } from 'devextreme-react/popup';

interface PopupHeaderProps {
    title: string;
    onClose: () => void;
}

const HeaderPopup = ({
    title,
    onClose,
}: PopupHeaderProps): React.ReactElement => (
    <div className='flex justify-between'>
        <div className='flex items-center justify-center text-2xl font-bold text-secondary-500'>
            {title}
        </div>
        <div className='w-12'>
            <Button
                icon={faXmark}
                size={'base'}
                onClick={onClose}
                style={'outline'}
            />
        </div>
    </div>
);

interface PopupProps {
    fileURL: string;
    isVisible: boolean;
    onClose: () => void;
    onShown: () => void;
    title: string;
}

const PopupPreview = ({
    fileURL,
    isVisible,
    onClose,
    onShown,
    title,
}: PopupProps): React.ReactElement => {
    const contentRender = useCallback(
        () => <iframe className='h-full w-full' src={`${fileURL}#view=Fit`} />,
        [fileURL]
    );

    const titleComponent = useCallback(
        () => <HeaderPopup title={title} onClose={onClose} />,
        [title, onClose]
    );

    return (
        <DxPopup
            contentRender={contentRender}
            dragEnabled={false}
            height='80vh'
            hideOnOutsideClick
            onHiding={onClose}
            onShown={onShown}
            titleComponent={titleComponent}
            visible={isVisible}
            width='80vw'
        >
            <Position of='#content' />
        </DxPopup>
    );
};

export default memo(PopupPreview);
