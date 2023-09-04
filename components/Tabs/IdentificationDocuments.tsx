'use client';
// React imports
import { useCallback, useEffect, useRef, useState } from 'react';
// Libraries imports
import Form, { Item, GroupItem } from 'devextreme-react/form';
import { ValueChangedEvent } from 'devextreme/ui/text_box';
import { FieldDataChangedEvent } from 'devextreme/ui/form';
import { identificationItems } from '@/lib/utils/selectBoxItems';
// Local imports
import { ContactData } from '@/lib/types/contactData';
import { dateFormat } from '@/lib/utils/datagrid/customFormats';
import ContactDeleteItem from './TabButtons/ContactDeleteItem';
import ContactAddItem from './TabButtons/ContactAddItem';
import { CompanyData } from '@/lib/types/companyData';

interface Props {
    contactData: ContactData;
    isEditing: boolean;
    isLoading: boolean;
}

const IdentificationDocuments = ({
    contactData,
    isEditing,
    isLoading,
}: Props) => {
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

    const checkExpirationDate = useCallback(
        (index: number) => {
            const expDate = contactData.identifications[index].expirationDate;
            if (expDate) {
                const today = new Date();
                const twoMonthsLater = new Date();
                twoMonthsLater.setMonth(today.getMonth() + 2);
                const dateElement = document.getElementById(
                    `expirationDate${index}`
                )?.firstElementChild;
                if (new Date(expDate) < today) {
                    dateElement?.classList.add('expired-document');
                } else if (new Date(expDate) < twoMonthsLater) {
                    dateElement?.classList.add('near-expiration');
                }
            }
        },
        [contactData]
    );

    const getExpirationDateHelpText = useCallback(
        (index: number) => {
            let expirationText = undefined;
            const expDate = contactData.identifications[index].expirationDate;
            if (expDate) {
                const today = new Date();
                const twoMonthsLater = new Date();
                twoMonthsLater.setMonth(today.getMonth() + 2);
                if (new Date(expDate) < today) {
                    expirationText = 'Expired';
                } else if (new Date(expDate) < twoMonthsLater) {
                    expirationText = 'Expiration date approaching';
                }
            }
            return expirationText;
        },
        [contactData]
    );

    const changeCssFormElement = (e: FieldDataChangedEvent) => {
        if (e.dataField !== 'formData') {
            setEventsList((prev) => [...prev, e]);
        }
    };

    const changeSelectbox = (e: ValueChangedEvent) => {
        setElementsList((prev) => [...prev, e]);
    };

    const callbackFunction = useCallback(
        (contactData: ContactData | CompanyData) => {
            formRef.current?.instance.updateData('formData', contactData);
            setAddressOptions([]);
        },
        []
    );

    return (
        <Form
            formData={contactData}
            ref={formRef}
            labelMode={'floating'}
            readOnly={isLoading || !isEditing}
            showValidationSummary
            onFieldDataChanged={changeCssFormElement}
        >
            <GroupItem colCount={1}>
                {contactData.identifications.map((identification, index) => {
                    return (
                        <GroupItem key={`GroupItem3-${index}`} colCount={6}>
                            <Item
                                key={`type${index}`}
                                dataField={`identifications[${index}].type`}
                                label={{
                                    text: 'Identification Type',
                                }}
                                editorType='dxSelectBox'
                                editorOptions={{
                                    elementAttr: {
                                        id: `type${index}`,
                                    },
                                    items: identificationItems,
                                    valueExpr: 'id',
                                    displayExpr: 'name',
                                    onValueChanged: (e: ValueChangedEvent) =>
                                        changeSelectbox(e),
                                }}
                            />
                            <Item
                                key={`number${index}`}
                                dataField={`identifications[${index}].number`}
                                label={{
                                    text: 'Document Number',
                                }}
                            />
                            <Item
                                key={`emissionDate${index}`}
                                dataField={`identifications[${index}].emissionDate`}
                                label={{
                                    text: 'Emission Date',
                                }}
                                editorType='dxDateBox'
                                editorOptions={{
                                    elementAttr: {
                                        id: `emissionDate${index}`,
                                    },
                                    displayFormat: dateFormat,
                                    showClearButton: true,
                                    onValueChanged: (e: ValueChangedEvent) =>
                                        changeSelectbox(e),
                                }}
                            />
                            <Item
                                key={`expirationDate${index}`}
                                dataField={`identifications[${index}].expirationDate`}
                                helpText={getExpirationDateHelpText(index)}
                                label={{
                                    text: 'Expiration Date',
                                }}
                                editorType='dxDateBox'
                                editorOptions={{
                                    elementAttr: {
                                        id: `expirationDate${index}`,
                                    },
                                    displayFormat: dateFormat,
                                    showClearButton: true,
                                    onContentReady: () =>
                                        checkExpirationDate(index),
                                    onValueChanged: (e: ValueChangedEvent) =>
                                        changeSelectbox(e),
                                }}
                            />
                            <Item
                                key={`identificationShortComment${index}`}
                                dataField={`identifications[${index}].shortComment`}
                                label={{
                                    text: 'Short Comment',
                                }}
                                editorOptions={{
                                    maxLength: 30,
                                }}
                            />
                            <Item>
                                <ContactDeleteItem
                                    data={contactData}
                                    key={`button3-${index}`}
                                    index={index}
                                    arrayType={'identifications'}
                                    isEditing={isEditing}
                                    callbackFunction={callbackFunction}
                                />
                            </Item>
                        </GroupItem>
                    );
                })}
            </GroupItem>
            <Item>
                <ContactAddItem
                    data={contactData}
                    arrayType={'identifications'}
                    isEditing={isEditing}
                    callbackFunction={callbackFunction}
                />
            </Item>
        </Form>
    );
};

export default IdentificationDocuments;