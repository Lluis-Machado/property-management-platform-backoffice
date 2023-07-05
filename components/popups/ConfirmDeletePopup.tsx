// React imports
import { useCallback } from 'react'

// Libraries imports
import { Button } from 'pg-components';
import { Popup, Position } from 'devextreme-react/popup';

interface PopupProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
};

const ConfirmDeletePopup = ({
    message,
    isVisible,
    onClose
}: PopupProps) => {
    const contentRender = useCallback(() => (
        <div className='flex flex-col gap-4'>
            <p className='text-lg'>{ message || 'Are you sure you want to delete this record?' }</p>
            <div className='flex gap-4'>
                <Button text='Cancel' style='outline' onClick={onClose} />
                <Button
                    text='Continue'
                    onClick={onClose}
                />
            </div>
        </div>
    ), [onClose]);

    return (
        <Popup
            contentRender={contentRender}
            dragEnabled={false}
            height='auto'
            hideOnOutsideClick={false}
            visible={isVisible}
            width='50vw'
        >
            <Position of='#content' />
        </Popup>
    );
};

export default ConfirmDeletePopup;