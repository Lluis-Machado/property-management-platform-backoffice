// React imports
import { useCallback } from 'react';

// Libraries imports
import { Button } from 'pg-components';
import { Popup, Position } from 'devextreme-react/popup';

interface PopupProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmDeletePopup = ({
    message,
    isVisible,
    onClose,
    onConfirm,
}: PopupProps) => {
    const contentRender = useCallback(
        () => (
            <div className='flex flex-col gap-4'>
                <div className='flex gap-4'>
                    <Button text='Cancel' style='outline' onClick={onClose} />
                    <Button
                        text='Continue'
                        onClick={() => {
                            onClose();
                            onConfirm();
                        }}
                    />
                </div>
            </div>
        ),
        [onClose]
    );

    const titleComponent = useCallback(
        () => (
            <div className='flex items-center justify-center text-2xl font-bold text-secondary-500'>
                {message || 'Are you sure you want to delete this record?'}
            </div>
        ),
        []
    );

    return (
        <Popup
            contentRender={contentRender}
            titleComponent={titleComponent}
            dragEnabled={false}
            height='auto'
            hideOnOutsideClick={false}
            visible={isVisible}
            width='40vw'
        >
            <Position of='#content' />
        </Popup>
    );
};

export default ConfirmDeletePopup;
