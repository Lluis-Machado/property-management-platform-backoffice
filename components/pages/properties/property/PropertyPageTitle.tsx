// React imports
import { useCallback, useState } from 'react';

// Libraries imports
import TextBox from 'devextreme-react/text-box';
import Tooltip from 'devextreme-react/tooltip';
import { ValueChangedEvent } from 'devextreme/ui/text_box';
import { PropertyData } from '@/lib/types/propertyInfo';

interface Props {
    propertyData: PropertyData;
    isLoading: boolean;
    isEditing: boolean;
    parentCallback: any;
}

const PropertyPageTitle = ({
    propertyData,
    isEditing,
    isLoading,
    parentCallback,
}: Props) => {
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
    };

    return (
        <div>
            {/* Contact avatar and name */}
            <TextBox
                value={propertyData.name}
                disabled={!isEditing || isLoading}
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
        </div>
    );
};
export default PropertyPageTitle;
