// React imports
import { useCallback } from 'react';

// Libraries imports
import { Button } from 'pg-components';
import { Popup, Position } from 'devextreme-react/popup';

interface PopupProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

const PopupGeneralDataGridOwnership = ({
    message,
    isVisible,
    onClose,
}: PopupProps) => {
    const contentRender = useCallback(
        () => (
            <div className='flex items-center justify-center'>
                <div className='w-2/5'>
                    <Button text='Close' onClick={onClose} />
                </div>
            </div>
        ),
        [onClose]
    );

    const titleComponent = useCallback(
        () => (
            <div className='flex items-center justify-center text-2xl font-bold text-secondary-500'>
                {message}
            </div>
        ),
        [message]
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

export default PopupGeneralDataGridOwnership;
