// React imports
import { useCallback } from 'react'

// Libraries imports
import { Button } from 'pg-components';
import { Popup, Position } from 'devextreme-react/popup';

interface PopupProps {
    isVisible: boolean;
    onClose: () => void;
};

const ChangePwPopup = ({ isVisible, onClose }: PopupProps) => {
    const contentRender = useCallback(() => (
        <div className='flex flex-col gap-4'>
            <p className='text-lg'>You will receive an email to change your password</p>
            <div className='flex gap-4'>
                <Button text='Cancel' style='outline' onClick={onClose} />
                <Button
                    text='Continue'
                    onClick={() => {
                        window.alert('Sending email to change password...')
                        onClose()
                    }}
                />
            </div>
        </div>
    ), [onClose]);

    const titleComponent = useCallback(() => (
        <div className='flex justify-between'>
            <div className='flex font-bold text-2xl text-secondary-500 justify-center items-center'>
                Change Password
            </div>
        </div>
    ), []);

    return (
        <Popup
            contentRender={contentRender}
            dragEnabled={false}
            height='auto'
            hideOnOutsideClick={false}
            titleComponent={titleComponent}
            visible={isVisible}
            width='50vw'
        >
            <Position of='#content' />
        </Popup>
    );
};

export default ChangePwPopup;