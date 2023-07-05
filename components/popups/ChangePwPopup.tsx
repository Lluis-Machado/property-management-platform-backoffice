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
        <div className='flex flex-col gap-4 justify-center items-center'>
            <p className='text-lg'>You will receive an email to change your password</p>
            <div className='flex gap-4 w-full'>
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
        <div className='flex font-bold text-2xl text-secondary-500 justify-center items-center'>
            Change Password
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
            width='30vw'
        >
            <Position of='#content' />
        </Popup>
    );
};

export default ChangePwPopup;