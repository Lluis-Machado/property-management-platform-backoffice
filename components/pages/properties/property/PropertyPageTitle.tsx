// React imports
import { useState } from 'react';

// Libraries imports
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box';
import Tooltip from 'devextreme-react/tooltip';
import { ValueChangedEvent } from 'devextreme/ui/text_box';
import { PropertyData } from '@/lib/types/propertyInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { icon } from '@fortawesome/fontawesome-svg-core';

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
    console.log(initialValues.name);
    const [name, setName] = useState(propertyData.name);
    const sendData = (e: ValueChangedEvent) => {
        const value = e.value;
        if (e.value != initialValues.name) {
            e.element.classList.add('styling');
        } else {
            e.element.classList.remove('styling');
        }
        setName(value);
        parentCallback(e.value);
        setIsEditingTitle(false);
    };

    // const editButton = {
    //     icon: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg>',
    //     onclick:() => setIsEditingTitle((prev) => !prev),
    // };
    return (
        <div className='flex flex-row'>
            {/* Contact avatar and name */}
            <TextBox
                value={propertyData.name}
                disabled={!isEditingTitle}
                onValueChanged={sendData}
                id='title'
                style={{
                    fontWeight: '800',
                    fontSize: '35px',
                    border: 'none',
                    opacity: '1',
                }}
            >
                {/* { isEditing && (<TextBoxButton
                    name="edit"
                    location="after"
                    options={editButton}
                /> )} */}
                {isEditing && (
                    <Tooltip
                        target='#title'
                        showEvent='mouseenter'
                        hideEvent='mouseleave'
                    >
                        <div
                            style={{
                                color: '#b99f6c',
                                fontWeight: 'bold',
                            }}
                        >
                            Be carefull you are changing the name of the
                            property
                        </div>
                    </Tooltip>
                )}
            </TextBox>
            <div className='flex items-center justify-center'>
                {isEditing && (
                    <FontAwesomeIcon
                        icon={faPencil}
                        size='xl'
                        color='#b99f6c'
                        onClick={() => setIsEditingTitle((prev) => !prev)}
                        style={{
                            color: isEditingTitle ? '#163047' : '',
                        }}
                    />
                )}
            </div>
        </div>
    );
};
export default PropertyPageTitle;
