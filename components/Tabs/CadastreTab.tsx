'use client';
// React imports
import { memo, useEffect, useRef, useState } from 'react';
// Libraries imports
import Form, { GroupItem, Item } from 'devextreme-react/form';
import { FieldDataChangedEvent } from 'devextreme/ui/form';
import { ValueChangedEvent } from 'devextreme/ui/text_box';
import TextBox, { Button as TextBoxButton } from 'devextreme-react/text-box';
// Local imports
import { PropertyData } from '@/lib/types/propertyInfo';

interface Props {
    propertyData: PropertyData;
    isEditing: boolean;
    isLoading: boolean;
}

const Cadastre = ({ propertyData, isEditing, isLoading }: Props) => {
    const [cadastreRef, setCadastreRef] = useState<string>(
        propertyData.cadastreRef
    );
    const [addressOptions, setAddressOptions] = useState(() => {
        console.log('Cadaste: ME INICIALIZO');
        return {};
    });
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

    const calculateCadastreValue = (e: ValueChangedEvent) => {
        propertyData.cadastreValue.value =
            propertyData.buildingPrice.value + propertyData.plotPrice.value;
        formRef.current!.instance.updateData(propertyData);
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
                    dataField='ibiCollection'
                    label={{ text: 'IBI Collection' }}
                    editorType='dxSelectBox'
                    editorOptions={{
                        elementAttr: {
                            id: `ibiCollection`,
                        },
                        items: [
                            { label: 'None', value: 0 },
                            { label: 'Yes', value: 1 },
                            { label: 'No', value: 2 },
                        ],
                        displayExpr: 'label',
                        valueExpr: 'value',
                        searchEnabled: true,
                        showClearButton: isEditing,
                        onValueChanged: (e: ValueChangedEvent) =>
                            changeSelectbox(e),
                    }}
                />
                <Item
                    dataField='ibiAmount.value'
                    label={{ text: 'IBI Amount' }}
                    editorOptions={{
                        elementAttr: {
                            id: `ibiAmount`,
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
            <GroupItem colCount={4}>
                <Item
                    dataField='garbageCollection'
                    label={{ text: 'Garbage Collection' }}
                    editorType='dxSelectBox'
                    editorOptions={{
                        elementAttr: {
                            id: `cadastreGarbageCollection`,
                        },
                        items: [
                            { label: 'None', value: 0 },
                            { label: 'Yes', value: 1 },
                            { label: 'No', value: 2 },
                        ],
                        displayExpr: 'label',
                        valueExpr: 'value',
                        searchEnabled: true,
                        showClearButton: isEditing,
                        onValueChanged: (e: ValueChangedEvent) =>
                            changeSelectbox(e),
                    }}
                />
                <Item
                    dataField='garbagePriceAmount.value'
                    label={{ text: 'Garbage Amount' }}
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
            <GroupItem colCount={4}>
                <Item>
                    <TextBox
                        defaultValue={cadastreRef}
                        onValueChange={(e) => {
                            setCadastreRef(e);
                        }}
                        readOnly={isLoading || !isEditing}
                        labelMode='floating'
                        label='Cadastre Nr.'
                    >
                        <TextBoxButton
                            name='catasterBtn'
                            location='after'
                            options={{
                                icon: '<svg xmlns="http://www.w3.org/2000/svg" id="arrowButtonIcon" height="0.8em" viewBox="0 0 512 512"><style>#arrowButtonIcon{fill:#ffffff}</style><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/></svg>',
                                type: 'default',
                                onClick: () =>
                                    propertyData.cadastreUrl &&
                                    window.open(
                                        propertyData.cadastreUrl,
                                        '_blank'
                                    ),
                                disabled: propertyData.cadastreUrl
                                    ? false
                                    : true,
                            }}
                        />
                    </TextBox>
                </Item>
                <GroupItem>
                    <Item
                        dataField='buildingPrice.value'
                        label={{ text: 'Building price' }}
                        editorOptions={{
                            elementAttr: {
                                id: `buildingPrice`,
                            },
                            onValueChanged: (e: ValueChangedEvent) => {
                                changeSelectbox(e);
                                calculateCadastreValue(e);
                            },
                            format: {
                                type: 'currency',
                                currency: 'EUR',
                                precision: 2,
                            },
                        }}
                    />
                    <Item
                        dataField='plotPrice.value'
                        label={{ text: 'Plot price' }}
                        editorOptions={{
                            elementAttr: {
                                id: `plotPrice`,
                            },
                            onValueChanged: (e: ValueChangedEvent) => {
                                changeSelectbox(e);
                                calculateCadastreValue(e);
                            },
                            format: {
                                type: 'currency',
                                currency: 'EUR',
                                precision: 2,
                            },
                        }}
                    />
                    <Item
                        dataField='cadastreValue.value'
                        label={{ text: 'Cadastre Value' }}
                        editorOptions={{
                            elementAttr: {
                                id: `propertyCadastreValue`,
                            },
                            onValueChanged: (e: ValueChangedEvent) => {
                                changeSelectbox(e);
                            },
                            readOnly: true,
                            format: {
                                type: 'currency',
                                currency: 'EUR',
                                precision: 2,
                            },
                        }}
                    />
                </GroupItem>
            </GroupItem>
        </Form>
    );
};

export default memo(Cadastre);
