// React imports
import { useCallback, useState } from 'react';

// Libraries imports
import TextBox from 'devextreme-react/text-box';
import Tooltip from 'devextreme-react/tooltip';
import { ValueChangedEvent } from 'devextreme/ui/text_box';
import { PropertyData } from '@/lib/types/propertyInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

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
    const [effect, setEffect] = useState(false);
    const [name, setName] = useState(propertyData.name);
    const sendData = (e: ValueChangedEvent) => {
        const value = e.value;
        if (e.value != propertyData.name) {
            e.element.classList.add('styling');
        } else {
            e.element.classList.remove('styling');
        }
        setName(value);
        parentCallback(e.value);
        setIsEditingTitle(false);
    };

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
                        icon={faPenToSquare}
                        size='2x'
                        color='#b99f6c'
                        onClick={() => setIsEditingTitle((prev) => !prev)}
                        style={{
                            color: isEditingTitle ? '#163047' : '',
                            backgroundColor: isEditingTitle ? '#EFE5D1' : '',
                        }}
                    />
                )}
            </div>
        </div>
    );
};
export default PropertyPageTitle;
