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

export const Purchase = ({ propertyData, isEditing, isLoading }: Props) => {
    let priceTax: number;
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

    // calculate Property
    const calculatePurchase = (e: ValueChangedEvent) => {
        propertyData.purchasePriceNet.value = e.value || 0;
        if (propertyData.purchasePriceTaxPercentage === 1) {
            propertyData.purchasePriceTax.value =
                (propertyData.purchasePriceNet.value! / 100) * 10;
            //AJD CALCULATION
            propertyData.purchasePriceAJD.value =
                (propertyData.purchasePriceNet.value / 100) *
                propertyData.purchasePriceAJDPercentage!;
            propertyData.purchasePriceTPO.value = 0;
            propertyData.purchasePriceTPOPercentage = 0;
        } else if (propertyData.purchasePriceTaxPercentage === 2) {
            propertyData.purchasePriceTax.value =
                (propertyData.purchasePriceNet.value! / 100) * 21;
            // AJD CALCULATION
            propertyData.purchasePriceAJD.value =
                (propertyData.purchasePriceNet.value / 100) *
                propertyData.purchasePriceAJDPercentage!;
            propertyData.purchasePriceTPO.value = 0;
            propertyData.purchasePriceTPOPercentage = 0;
        } else {
            propertyData.purchasePriceTax.value =
                propertyData.purchasePriceNet.value;
            //TPO CALCULATION
            propertyData.purchasePriceTPO.value =
                (propertyData.purchasePriceNet.value / 100) *
                propertyData.purchasePriceTPOPercentage!;
            propertyData.purchasePriceAJD.value = 0;
            propertyData.purchasePriceAJDPercentage = 0;
        }
        calculateBruttoValue();
        calculateTotalPrice();
        calculatePurchasePrice();
    };
    const calculatePriceTax = (e: ValueChangedEvent) => {
        if (e.value == 1) {
            priceTax = (propertyData.purchasePriceNet.value / 100) * 10;
            propertyData.purchasePriceTax.value = priceTax;
            propertyData.purchasePriceTaxPercentage = e.value;
            propertyData.purchasePriceTPO.value = 0;
            propertyData.purchasePriceTPOPercentage = 0;
            calculateBruttoValue();
            calculateTotalPrice();
            calculatePurchasePrice();
            formRef
                .current!.instance.getEditor('purchasePriceAJD.value')!
                .option('visible', true);
            formRef
                .current!.instance.getEditor('purchasePriceAJDPercentage')!
                .option('visible', true);
            formRef
                .current!.instance.getEditor('purchasePriceTPO.value')!
                .option('visible', false);
            formRef
                .current!.instance.getEditor('purchasePriceTPOPercentage')!
                .option('visible', false);
        } else if (e.value == 2) {
            priceTax = (propertyData.purchasePriceNet.value / 100) * 21;
            propertyData.purchasePriceTax.value = priceTax;
            propertyData.purchasePriceTaxPercentage = e.value;
            propertyData.purchasePriceTPO.value = 0;
            propertyData.purchasePriceTPOPercentage = 0;
            calculateBruttoValue();
            calculateTotalPrice();
            calculatePurchasePrice();
            formRef
                .current!.instance.getEditor('purchasePriceAJD.value')!
                .option('visible', true);
            formRef
                .current!.instance.getEditor('purchasePriceAJDPercentage')!
                .option('visible', true);
            formRef
                .current!.instance.getEditor('purchasePriceTPO.value')!
                .option('visible', false);
            formRef
                .current!.instance.getEditor('purchasePriceTPOPercentage')!
                .option('visible', false);
        } else {
            propertyData.purchasePriceTax.value = 0;
            propertyData.purchasePriceTaxPercentage = 0;
            propertyData.purchasePriceGross.value =
                propertyData.purchasePriceNet.value;
            propertyData.purchasePriceAJD.value = 0;
            propertyData.purchasePriceAJDPercentage = 0;
            calculateTotalPrice();
            calculatePurchasePrice();
            formRef
                .current!.instance.getEditor('purchasePriceAJD.value')!
                .option('visible', false);
            formRef
                .current!.instance.getEditor('purchasePriceAJDPercentage')!
                .option('visible', false);
            formRef
                .current!.instance.getEditor('purchasePriceTPO.value')!
                .option('visible', true);
            formRef
                .current!.instance.getEditor('purchasePriceTPOPercentage')!
                .option('visible', true);
        }
    };

    const calculateBruttoValue = () => {
        propertyData.purchasePriceGross.value =
            propertyData.purchasePriceNet.value +
            propertyData.purchasePriceTax.value;
    };

    const calculateTPOValue = (e: ValueChangedEvent) => {
        propertyData.purchasePriceTPO.value =
            (propertyData.purchasePriceNet.value / 100) * e.value;
        propertyData.purchasePriceAJD.value = 0;
        propertyData.purchasePriceAJDPercentage = 0;
        calculateTotalPrice();
        calculatePurchasePrice();
    };

    const calculateAJDValue = (e: ValueChangedEvent) => {
        propertyData.purchasePriceAJD.value =
            (propertyData.purchasePriceNet.value / 100) * e.value;
        propertyData.purchasePriceTPO.value = 0;
        propertyData.purchasePriceTPOPercentage = 0;
        calculateTotalPrice();
        calculatePurchasePrice();
    };

    const calculateTotalPrice = () => {
        propertyData.purchasePriceTotal.value =
            propertyData.purchasePriceGross.value +
            propertyData.purchasePriceTPO.value +
            propertyData.purchasePriceAJD.value;
    };
    // Furniture
    const calculateNet = (e: ValueChangedEvent) => {
        propertyData.furniturePriceIVA.value =
            (e.value / 100) * propertyData.furniturePriceIVAPercentage;
        calculateBruttoValueFurniture();
        calculateTPOValueFurniture();
        calculateTotalPriceFurniture();
        calculatePurchasePrice();
    };
    const calculatePriceTaxFurniture = (e: ValueChangedEvent) => {
        propertyData.furniturePriceIVA.value =
            (propertyData.furniturePrice.value / 100) * e.value;
        calculateBruttoValueFurniture();
        calculateTPOValueFurniture();
        calculateTotalPriceFurniture();
        calculatePurchasePrice();
    };
    const calculateBruttoValueFurniture = () => {
        propertyData.furniturePriceGross.value =
            propertyData.furniturePrice.value +
            propertyData.furniturePriceIVA.value;
    };
    const calculateTPOValueFurniture = () => {
        propertyData.furniturePriceTPO.value =
            (propertyData.furniturePrice.value / 100) * 2;
    };
    const calculateTotalPriceFurniture = () => {
        propertyData.furniturePriceTotal.value =
            propertyData.furniturePriceGross.value +
            propertyData.furniturePriceTPO.value;
    };
    // TOTAL PURCHASE CALCULATION
    const calculatePurchasePrice = () => {
        propertyData.priceTotal.value =
            propertyData.furniturePriceTotal.value +
            propertyData.purchasePriceTotal.value;
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
            <GroupItem>
                <GroupItem colCount={3}>
                    <GroupItem caption='Property' colCount={2}>
                        <Item
                            dataField='purchasePriceNet.value'
                            label={{ text: 'Netto' }}
                            colSpan={2}
                            editorOptions={{
                                elementAttr: {
                                    id: `purchasePriceNet`,
                                },
                                onValueChanged: (e: ValueChangedEvent) => {
                                    changeSelectbox(e);
                                    calculatePurchase(e);
                                },
                                format: {
                                    type: 'currency',
                                    currency: 'EUR',
                                    precision: 2,
                                },
                            }}
                        />
                        <Item
                            dataField='purchasePriceTax.value'
                            label={{ text: 'IVA' }}
                            editorOptions={{
                                elementAttr: {
                                    id: `purchasePriceTax`,
                                },
                                onValueChanged: (e: ValueChangedEvent) =>
                                    changeSelectbox(e),
                                readOnly: true,
                                format: {
                                    type: 'currency',
                                    currency: 'EUR',
                                    precision: 2,
                                },
                            }}
                        />
                        <Item
                            dataField='purchasePriceTaxPercentage'
                            label={{ text: 'IVA %' }}
                            editorType='dxSelectBox'
                            colCount={1}
                            editorOptions={{
                                elementAttr: {
                                    id: `purchasePriceTaxPercentage`,
                                },
                                items: [
                                    {
                                        label: 'Sin IVA',
                                        value: 0,
                                    },
                                    {
                                        label: '10%',
                                        value: 1,
                                    },
                                    {
                                        label: '21%',
                                        value: 2,
                                    },
                                ],
                                displayExpr: 'label',
                                valueExpr: 'value',
                                searchEnabled: true,
                                showClearButton: isEditing,
                                onValueChanged: (e: ValueChangedEvent) => {
                                    changeSelectbox(e);
                                    calculatePriceTax(e);
                                },
                                readOnly: !isEditing,
                            }}
                        />
                        <Item
                            dataField='purchasePriceGross.value'
                            label={{ text: 'Brutto' }}
                            colSpan={2}
                            editorOptions={{
                                elementAttr: {
                                    id: `purchasePriceGross`,
                                },
                                onValueChanged: (e: ValueChangedEvent) =>
                                    changeSelectbox(e),
                                readOnly: true,
                                format: {
                                    type: 'currency',
                                    currency: 'EUR',
                                    precision: 2,
                                },
                            }}
                        />
                        <Item
                            dataField='purchasePriceTPO.value'
                            label={{ text: 'TPO' }}
                            colSpan={1}
                            editorOptions={{
                                readOnly: true,
                                format: {
                                    type: 'currency',
                                    currency: 'EUR',
                                    precision: 2,
                                },
                                visible:
                                    true &&
                                    propertyData.purchasePriceTaxPercentage ==
                                        0,
                            }}
                        />
                        <Item
                            dataField='purchasePriceTPOPercentage'
                            label={{ text: 'TPO %' }}
                            colSpan={1}
                            editorOptions={{
                                elementAttr: {
                                    id: `purchasePriceTPOPercentage`,
                                },
                                onValueChanged: (e: ValueChangedEvent) => {
                                    calculateTPOValue(e);
                                    changeSelectbox(e);
                                },
                                format: "#0.##'%'",
                                visible:
                                    true &&
                                    propertyData.purchasePriceTaxPercentage ==
                                        0,
                            }}
                        />
                        <Item
                            dataField='purchasePriceAJD.value'
                            label={{ text: 'AJD' }}
                            editorOptions={{
                                elementAttr: {
                                    id: `purchasePriceAJD`,
                                },
                                onValueChanged: (e: ValueChangedEvent) =>
                                    changeSelectbox(e),
                                readOnly: true,
                                format: {
                                    type: 'currency',
                                    currency: 'EUR',
                                    precision: 2,
                                },
                                visible:
                                    true &&
                                    propertyData.purchasePriceTaxPercentage !==
                                        0,
                            }}
                        />
                        <Item
                            dataField='purchasePriceAJDPercentage'
                            label={{ text: 'AJD %' }}
                            editorOptions={{
                                elementAttr: {
                                    id: `purchasePriceAJDPercentage`,
                                },
                                onValueChanged: (e: ValueChangedEvent) => {
                                    calculateAJDValue(e);
                                    changeSelectbox(e);
                                },
                                readOnly: !isEditing,
                                format: "#0.##'%'",
                                visible:
                                    true &&
                                    propertyData.purchasePriceTaxPercentage !==
                                        0,
                            }}
                        />
                        <Item
                            dataField='purchasePriceTotal.value'
                            label={{
                                text: 'Total Property Purchase Price',
                            }}
                            colSpan={2}
                            editorOptions={{
                                elementAttr: {
                                    id: `purchasePriceTotal`,
                                },
                                onValueChanged: (e: ValueChangedEvent) =>
                                    changeSelectbox(e),
                                readOnly: true,
                                format: {
                                    type: 'currency',
                                    currency: 'EUR',
                                    precision: 2,
                                },
                            }}
                        />
                    </GroupItem>
                    <GroupItem caption='Furniture'>
                        <Item
                            dataField='furniturePrice.value'
                            label={{ text: 'Netto' }}
                            editorOptions={{
                                elementAttr: {
                                    id: `furniturePrice`,
                                },
                                onValueChanged: (e: ValueChangedEvent) => {
                                    changeSelectbox(e);
                                    calculateNet(e);
                                },
                                format: {
                                    type: 'currency',
                                    currency: 'EUR',
                                    precision: 2,
                                },
                            }}
                        />
                        <GroupItem colCount={2}>
                            <Item
                                dataField='furniturePriceIVA.value'
                                label={{ text: 'IVA' }}
                                editorOptions={{
                                    elementAttr: {
                                        id: `furniturePriceIVA`,
                                    },
                                    onValueChanged: (e: ValueChangedEvent) => {
                                        changeSelectbox(e);
                                    },
                                    format: {
                                        type: 'currency',
                                        currency: 'EUR',
                                        precision: 2,
                                    },
                                }}
                            />
                            <Item
                                dataField='furniturePriceIVAPercentage'
                                label={{ text: 'IVA %' }}
                                editorOptions={{
                                    elementAttr: {
                                        id: `furniturePriceIVAPercentage`,
                                    },
                                    onValueChanged: (e: ValueChangedEvent) => {
                                        calculatePriceTaxFurniture(e);
                                        changeSelectbox(e);
                                    },
                                    format: "#0.##'%'",
                                    readOnly: !isEditing,
                                }}
                            />
                        </GroupItem>
                        <Item
                            dataField='furniturePriceGross.value'
                            label={{ text: 'Brutto' }}
                            editorOptions={{
                                elementAttr: {
                                    id: `furniturePriceGross`,
                                },
                                onValueChanged: (e: ValueChangedEvent) =>
                                    changeSelectbox(e),
                                readOnly: true,
                                format: {
                                    type: 'currency',
                                    currency: 'EUR',
                                    precision: 2,
                                },
                            }}
                        />
                        <GroupItem colCount={2}>
                            <Item
                                dataField='furniturePriceTPO.value'
                                label={{ text: 'TPO/ ITP' }}
                                editorOptions={{
                                    elementAttr: {
                                        id: `furniturePriceTPO`,
                                    },
                                    onValueChanged: (e: ValueChangedEvent) =>
                                        changeSelectbox(e),
                                    readOnly: true,
                                    format: {
                                        type: 'currency',
                                        currency: 'EUR',
                                        precision: 2,
                                    },
                                }}
                            />
                            <Item
                                dataField='furniturePriceTPOPercentage'
                                label={{ text: 'TPO/ITP %' }}
                                editorType='dxSelectBox'
                                editorOptions={{
                                    elementAttr: {
                                        id: `furniturePriceTPOPercentage`,
                                    },
                                    items: [
                                        {
                                            label: '2%',
                                            value: 0,
                                        },
                                    ],
                                    displayExpr: 'label',
                                    valueExpr: 'value',
                                    showClearButton: isEditing,
                                    onValueChanged: () =>
                                        calculateTPOValueFurniture(),
                                    readOnly: true,
                                }}
                            />
                        </GroupItem>
                        {/* <EmptyItem /> */}
                        <Item
                            dataField='furniturePriceTotal.value'
                            label={{
                                text: 'Total Furniture Price',
                            }}
                            colSpan={2}
                            editorOptions={{
                                elementAttr: {
                                    id: `furniturePriceTotal`,
                                },
                                onValueChanged: (e: ValueChangedEvent) =>
                                    changeSelectbox(e),
                                readOnly: true,
                                format: {
                                    type: 'currency',
                                    currency: 'EUR',
                                    precision: 2,
                                },
                            }}
                        />
                    </GroupItem>
                    <GroupItem caption='Purchase Date'>
                        <Item
                            dataField='purchaseDate'
                            label={{ text: 'Purchase Date' }}
                            editorType='dxDateBox'
                            editorOptions={{
                                elementAttr: {
                                    id: `purchaseDate`,
                                },
                                onValueChanged: (e: ValueChangedEvent) =>
                                    changeSelectbox(e),
                            }}
                        />
                    </GroupItem>
                </GroupItem>
                <GroupItem colCount={3}>
                    <Item
                        dataField='priceTotal.value'
                        label={{ text: 'Total Purchase Price' }}
                        colSpan={2}
                        editorOptions={{
                            elementAttr: {
                                id: `priceTotal`,
                            },
                            onValueChanged: (e: ValueChangedEvent) =>
                                changeSelectbox(e),
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
