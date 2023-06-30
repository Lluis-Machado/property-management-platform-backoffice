// React imports
import { useCallback, useRef } from 'react';

// Librares imports
import { Button, Input } from 'pg-components';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import Popup from 'devextreme-react/popup';

export type FormPopupType = 'New directory' | 'Rename' | 'Delete';

interface Props {
    folderName?: string;
    onHiding: () => void;
    onShown: () => void;
    onSubmit: (value?: string) => void;
    type: FormPopupType;
    visible: boolean;
};

const FormPopup = ({ folderName, onHiding, onShown, onSubmit, type, visible }: Props): React.ReactElement => {
    const PopupRef = useRef<Popup>(null);

    const FolderNameForm = useCallback(({ submitText }: { submitText: string }): React.ReactElement => {
        const validationSchema = Yup.object().shape({
            folderName: Yup.string().required('Cannot be empty').trim().matches(/^[a-zA-Z\s]+$/g, 'Only characters are accepted'),
        });
        return (
            <Formik
                initialValues={{ folderName }}
                onSubmit={(values) => {
                    onSubmit(values.folderName);
                    PopupRef.current?.instance.hide()
                }}
                validationSchema={validationSchema}
            >
                <Form className='flex flex-col'>
                    <Input
                        name='folderName'
                        required
                    />
                    <div className='flex justify-end'>
                        <div className='flex flex-row gap-2 justify-end w-3/4'>
                            <Button text={submitText} type='submit' />
                            <Button text='Cancel' type='reset' style='outline' onClick={() => PopupRef.current?.instance.hide()} />
                        </div>
                    </div>
                </Form>
            </Formik>
        );
    }, [folderName, onSubmit]);

    const NewDirectoryRender = useCallback((): React.ReactElement => (
        <FolderNameForm submitText='Create' />
    ), [FolderNameForm]);

    const RenameRender = useCallback((): React.ReactElement => (
        <FolderNameForm submitText='Save' />
    ), [FolderNameForm]);

    const DeleteRender = useCallback((): React.ReactElement => (
        <div className='flex flex-col justify-between h-full'>
            <p>
                {`Are you sure you want to delete ${folderName}?`}
            </p>
            <div className='flex justify-end'>
                <div className='flex flex-row gap-2 justify-end w-3/4'>
                    <Button text='Delete' onClick={() => { onSubmit(); PopupRef.current?.instance.hide() }} />
                    <Button text='Cancel' style='outline' onClick={() => PopupRef.current?.instance.hide()} />
                </div>
            </div>
        </div>
    ), [folderName, onSubmit]);

    const ContentRender = useCallback((): React.ReactElement => {
        const components = {
            'Delete': <DeleteRender />,
            'New directory': <NewDirectoryRender />,
            'Rename': <RenameRender />
        };

        return components[type];
    }, [DeleteRender, NewDirectoryRender, RenameRender, type]);

    return (
        <Popup
            contentRender={ContentRender}
            height='auto'
            hideOnOutsideClick
            maxWidth={340}
            onHiding={onHiding}
            onShown={onShown}
            ref={PopupRef}
            title={type}
            visible={visible}
            width='80vw'
        />
    );
};

export default FormPopup;