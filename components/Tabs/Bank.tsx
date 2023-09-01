'use client';
// React imports
import { useCallback, useEffect, useRef, useState } from 'react';
// Libraries imports
import Form, { Item, GroupItem } from 'devextreme-react/form';
import { ValueChangedEvent } from 'devextreme/ui/text_box';
import { FieldDataChangedEvent } from 'devextreme/ui/form';
// Local imports
import { ContactData } from '@/lib/types/contactData';
import { CompanyData } from '@/lib/types/companyData';
import ContactAddItem from './TabButtons/ContactAddItem';
import ContactDeleteItem from './TabButtons/ContactDeleteItem';

interface Props {
    contactsData: ContactData[];
    contactData: ContactData;
    isEditing: boolean;
    isLoading: boolean;
}
const Bank = ({ contactData, contactsData, isEditing, isLoading }: Props) => {
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
                {contactData.bankInformation.map((bank, index) => {
                    return (
                        <GroupItem key={`GroupItem4-${index}`} colCount={5}>
                            <Item
                                key={`bankName${index}`}
                                dataField={`bankInformation[${index}].bankName`}
                                label={{
                                    text: 'Bank Name',
                                }}
                            />
                            <Item
                                key={`iban${index}`}
                                dataField={`bankInformation[${index}].iban`}
                                label={{
                                    text: 'IBAN',
                                }}
                            />
                            <Item
                                key={`bic${index}`}
                                dataField={`bankInformation[${index}].bic`}
                                label={{
                                    text: 'BIC',
                                }}
                            />
                            <Item
                                key={`contactPerson${index}`}
                                dataField={`bankInformation[${index}].contactPerson`}
                                label={{
                                    text: 'Contact Person',
                                }}
                                editorType='dxSelectBox'
                                editorOptions={{
                                    elementAttr: {
                                        id: `contactPerson${index}`,
                                    },
                                    items: contactsData,
                                    displayExpr: (item: ContactData) => {
                                        if (!item) return;
                                        if (item.firstName)
                                            return `${item.firstName} ${item.lastName}`;
                                        else return `${item.lastName}`;
                                    },
                                    valueExpr: 'id',
                                    searchEnabled: true,
                                    onValueChanged: (e: any) => {
                                        changeSelectbox(e);
                                    },
                                }}
                            />
                            <Item>
                                <ContactDeleteItem
                                    data={contactData}
                                    key={`button4-${index}`}
                                    index={index}
                                    arrayType={'bankInformation'}
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
                    arrayType={'bankInformation'}
                    isEditing={isEditing}
                    callbackFunction={callbackFunction}
                />
            </Item>
        </Form>
    );
};

export default Bank;
