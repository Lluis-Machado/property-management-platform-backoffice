'use client';
// React imports
import { useEffect, useRef, useState } from 'react';
// Libraries imports
import Form, { GroupItem, Item } from 'devextreme-react/form';
import { FieldDataChangedEvent } from 'devextreme/ui/form';
import { ValueChangedEvent } from 'devextreme/ui/text_box';
// Local imports
import { PropertyData } from '@/lib/types/propertyInfo';

interface Props {
    propertyData: PropertyData;
    isEditing: boolean;
    isLoading: boolean;
}

const OtherInformation = ({ propertyData, isEditing, isLoading }: Props) => {
    const [addressOptions, setAddressOptions] = useState({});
    const [eventsList, setEventsList] = useState<FieldDataChangedEvent[]>([]);
    const [elementsList, setElementsList] = useState<ValueChangedEvent[]>([]);
    const formRef = useRef<Form>(null);

    useEffect(() => {
        for (const element of elementsList) {
            document
                .getElementById(element.element.attributes[1].nodeValue!)
                ?.classList.add('stylingForm');
        }
        for (const event of eventsList) {
            document
                .getElementsByName(event.dataField!)[0]
                ?.classList.add('styling');
        }
    }, [eventsList, elementsList, addressOptions]);

    const changeCssFormElement = (e: FieldDataChangedEvent) => {
        if (e.dataField !== 'formData') {
            setEventsList((prev) => [...prev, e]);
        }
    };

    const changeSelectbox = (e: ValueChangedEvent) => {
        setElementsList((prev) => [...prev, e]);
    };
    return (
        <Form
            formData={propertyData}
            labelMode='floating'
            readOnly={isLoading || !isEditing}
            onFieldDataChanged={changeCssFormElement}
            ref={formRef}
        >
            <GroupItem colCount={4}>
                <Item
                    dataField='bedNumber'
                    label={{ text: 'Bed Number' }}
                    editorOptions={{
                        elementAttr: {
                            id: `bedNumber`,
                        },
                        onValueChanged: (e: ValueChangedEvent) =>
                            changeSelectbox(e),
                    }}
                />
                <Item
                    dataField='year'
                    label={{ text: 'Year' }}
                    editorOptions={{
                        elementAttr: {
                            id: `year`,
                        },
                        onValueChanged: (e: ValueChangedEvent) =>
                            changeSelectbox(e),
                    }}
                />
                <Item
                    dataField='garbageCollection'
                    label={{ text: 'Garbage Collection' }}
                    editorType='dxDateBox'
                    editorOptions={{
                        elementAttr: {
                            id: `garbageCollection`,
                        },
                        onValueChanged: (e: ValueChangedEvent) =>
                            changeSelectbox(e),
                    }}
                />
                <Item
                    dataField='garbagePriceAmount.value'
                    label={{ text: 'Garbage Price Amount' }}
                    editorOptions={{
                        elementAttr: {
                            id: `garbagePriceAmount`,
                        },
                        onValueChanged: (e: ValueChangedEvent) =>
                            changeSelectbox(e),
                        format: {
                            type: 'currency',
                            currency: 'EUR',
                            precision: 2,
                        },
                    }}
                />
            </GroupItem>
        </Form>
    );
};

export default OtherInformation;
