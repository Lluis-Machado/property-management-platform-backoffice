// React imports
import { useState } from 'react';

// Libraries imports
import { TextBox } from 'devextreme-react/text-box';
import Tooltip from 'devextreme-react/tooltip';
import { ValueChangedEvent } from 'devextreme/ui/text_box';
import { PropertyData } from '@/lib/types/propertyInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import '../../../../lib/styles/propertyName.css';
import {
    Validator,
    RequiredRule,
    StringLengthRule,
} from 'devextreme-react/validator';

interface Props {
    propertyData: PropertyData;
    isLoading: boolean;
    isEditing: boolean;
    parentCallback: any;
}

const PropertyPageTitle = ({
    propertyData,
    isEditing,
    parentCallback,
}: Props) => {
    const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
    const [initialValues, setInitialValues] = useState<PropertyData>(
        structuredClone(propertyData)
    );
    const [name, setName] = useState(propertyData.name);
    const sendData = ({ value, element }: ValueChangedEvent) => {
        const isNameChanged = value !== initialValues.name;
        element.classList.toggle('styling', isNameChanged);
        setName(value);
        parentCallback(value);
        setIsEditingTitle(false);
    };

    return (
        <div className='flex flex-row'>
            {/* Contact avatar and name */}
            <TextBox
                value={propertyData.name}
                disabled={!isEditing || !isEditingTitle}
                onValueChanged={sendData}
                id='title'
                elementAttr={{
                    class: !isEditing
                        ? 'titleProperty'
                        : 'titlePropertyEditingMode',
                }}
                className='grow overflow-hidden text-ellipsis'
            >
                {isEditingTitle && (
                    <Tooltip
                        target='#title'
                        showEvent='mouseenter'
                        hideEvent='mouseleave'
                    >
                        <div
                            style={{
                                color: '#b99f6c',
                                fontWeight: 'bold',
                                fontSize: '16px',
                            }}
                        >
                            Be carefull you are changing the name of the
                            property. <br /> This has effect on the naming of
                            all the documents.
                        </div>
                    </Tooltip>
                )}
                <Validator>
                    <RequiredRule />
                    <StringLengthRule
                        min={3}
                        message='The property name has to have at least 3 letters'
                    />
                </Validator>
            </TextBox>
            <div className='mb-2 mr-10 flex items-end justify-center'>
                {isEditing && (
                    <div>
                        <FontAwesomeIcon
                            icon={faPencil}
                            id='editButtonTitle'
                            size='lg'
                            color='#b99f6c'
                            onClick={() => setIsEditingTitle((prev) => !prev)}
                            className={
                                isEditingTitle ? 'text-secondary-400' : ''
                            }
                        />
                        <Tooltip
                            target='#editButtonTitle'
                            showEvent='mouseenter'
                            hideEvent='mouseleave'
                        >
                            {!isEditingTitle ? (
                                <div className='text-base text-primary-700'>
                                    Edit title property
                                </div>
                            ) : (
                                <div className='text-base text-primary-700'>
                                    Cancel edit title property
                                </div>
                            )}
                        </Tooltip>
                    </div>
                )}
            </div>
        </div>
    );
};
export default PropertyPageTitle;
