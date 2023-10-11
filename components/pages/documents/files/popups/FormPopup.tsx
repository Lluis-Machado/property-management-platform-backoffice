// React imports
import { FC, memo, useCallback, useRef, useState } from 'react';

// Librares imports
import { Button, Input } from 'pg-components';
import Popup from 'devextreme-react/popup';
import TextBox from 'devextreme-react/text-box';

/**
 * Represents the type of form actions for the FormPopup component.
 */
export type FormPopupType = 'New folder' | 'Rename' | 'Delete';

interface Props {
    /**
     * The name of the element to be affected (used for Rename and Delete actions).
     */
    elementName?: string;
    /**
     * Callback function to be executed when the popup is hiding.
     */
    onHiding: () => void;
    /**
     * Callback function to be executed when the popup is shown.
     */
    onShown: () => void;
    /**
     * Callback function to be executed when the form is submitted.
     * @param value - The optional value submitted with the form (used for New Directory and Rename actions).
     */
    onSubmit: (value?: string) => void;
    /**
     * The type of form action to be displayed. Can be one of 'New folder', 'Rename', or 'Delete'.
     */
    type: FormPopupType;
    /**
     * Specifies whether the popup is visible or not.
     */
    visible: boolean;
}

/**
 * Represents a Popup with multiple layouts depending on the provided type..
 */
const FormPopup: FC<Props> = memo(function FormPopup({
    elementName,
    onHiding,
    onShown,
    onSubmit,
    type,
    visible,
}): React.ReactElement {
    const PopupRef = useRef<Popup>(null);
    const [name, setName] = useState(elementName);

    /**
     * Renders the form for the 'New folder' and 'Rename' action.
     *
     * @param submitText - The text to be displayed on the submit button.
     */
    const FolderNameForm = useCallback(
        ({ submitText }: { submitText: string }): React.ReactElement => {
            return (
                <>
                    <TextBox
                        value={name}
                        onValueChange={(e) => setName(e)}
                        valueChangeEvent='keyup'
                    />
                    <div className='mt-4 flex justify-end'>
                        <div className='flex w-3/4 flex-row justify-end gap-2'>
                            <Button
                                text={submitText}
                                onClick={() => {
                                    onSubmit(name);
                                    PopupRef.current?.instance.hide();
                                }}
                            />
                            <Button
                                text='Cancel'
                                type='button'
                                style='outline'
                                onClick={() =>
                                    PopupRef.current?.instance.hide()
                                }
                            />
                        </div>
                    </div>
                </>
            );
        },
        [elementName, onSubmit, name]
    );
    /**
     * Renders the form for the 'New folder' action.
     */
    const NewDirectoryRender = useCallback(
        (): React.ReactElement => <FolderNameForm submitText='Create' />,
        [FolderNameForm]
    );

    /**
     * Renders the form for the 'Rename' action.
     */
    const RenameRender = useCallback(
        (): React.ReactElement => <FolderNameForm submitText='Save' />,
        [FolderNameForm]
    );

    /**
     * Renders the form for the 'Delete' action.
     */
    const DeleteRender = useCallback(
        (): React.ReactElement => (
            <div className='flex h-full flex-col justify-between gap-4'>
                <p>{`Are you sure you want to delete ${elementName}?`}</p>
                <div className='flex justify-end'>
                    <div className='flex w-3/4 flex-row justify-end gap-2'>
                        <Button
                            text='Delete'
                            onClick={() => {
                                onSubmit();
                                PopupRef.current?.instance.hide();
                            }}
                        />
                        <Button
                            text='Cancel'
                            style='outline'
                            onClick={() => PopupRef.current?.instance.hide()}
                        />
                    </div>
                </div>
            </div>
        ),
        [elementName, onSubmit]
    );

    /**
     * Renders the content of the popup based on the selected form action.
     */
    const ContentRender = useCallback((): React.ReactElement => {
        const components = {
            Delete: <DeleteRender />,
            'New folder': <NewDirectoryRender />,
            Rename: <RenameRender />,
        };

        return components[type];
    }, [DeleteRender, NewDirectoryRender, RenameRender, type]);

    return (
        <Popup
            container='#content'
            contentRender={ContentRender}
            dragEnabled={false}
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
});

export default FormPopup;
