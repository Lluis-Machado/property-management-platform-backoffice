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
import AddItem from './TabButtons/AddItem';
import DeleteItem from './TabButtons/DeleteItem';

interface Props {
    dataSource: ContactData | CompanyData;
    contactsData: ContactData[];
    isEditing: boolean;
    isLoading: boolean;
}
const BankTab = ({ dataSource, contactsData, isEditing, isLoading }: Props) => {
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
        (dataSource: ContactData | CompanyData) => {
            formRef.current?.instance.updateData('formData', dataSource);
            setAddressOptions([]);
        },
        []
    );
    return (
        <Form
            formData={dataSource}
            ref={formRef}
            labelMode={'floating'}
            readOnly={isLoading || !isEditing}
            showValidationSummary
            onFieldDataChanged={changeCssFormElement}
        >
            <GroupItem colCount={1}>
                {dataSource.bankInformation.map((bank, index) => {
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
                                <DeleteItem
                                    data={dataSource}
                                    customKey={`button4-${index}`}
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
                <AddItem
                    data={dataSource}
                    arrayType={'bankInformation'}
                    isEditing={isEditing}
                    callbackFunction={callbackFunction}
                />
            </Item>
        </Form>
    );
};

export default BankTab;
