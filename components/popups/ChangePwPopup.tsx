// React imports
import { useCallback } from 'react';

// Libraries imports
import { Button } from 'pg-components';
import { Popup, Position } from 'devextreme-react/popup';

interface PopupProps {
    isVisible: boolean;
    onClose: () => void;
}

const ChangePwPopup = ({ isVisible, onClose }: PopupProps) => {
    const contentRender = useCallback(
        () => (
            <div className='flex flex-col items-center justify-center gap-4'>
                <p className='text-lg'>
                    You will receive an email to change your password
                </p>
                <div className='flex w-full gap-4'>
                    <Button text='Cancel' style='outline' onClick={onClose} />
                    <Button
                        text='Continue'
                        onClick={() => {
                            window.alert('Sending email to change password...');
                            onClose();
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
                Change Password
            </div>
        ),
        []
    );

    return (
        <Popup
            contentRender={contentRender}
            dragEnabled={false}
            height='auto'
            hideOnOutsideClick={false}
            titleComponent={titleComponent}
            visible={isVisible}
            width='30vw'
        >
            <Position of='#content' />
        </Popup>
    );
};

export default ChangePwPopup;
