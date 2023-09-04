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
import { displayContactFullName } from '@/lib/utils/displayContactFullName';
import { companyContactsTypeItems } from '@/lib/utils/selectBoxItems';

interface Props {
    dataSource: CompanyData;
    contactsData: ContactData[];
    isEditing: boolean;
    isLoading: boolean;
}

const ContactsTab = ({
    dataSource,
    contactsData,
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
                {dataSource.contacts.map((phone, index) => {
                    return (
                        <GroupItem
                            key={`GroupItemContacts-${index}`}
                            colCount={6}
                        >
                            <Item
                                key={`contactType${index}`}
                                dataField={`contacts[${index}].contactType`}
                                label={{ text: 'Contact Type' }}
                                editorType='dxSelectBox'
                                editorOptions={{
                                    elementAttr: {
                                        id: `contactType65435456${index}`,
                                    },
                                    items: companyContactsTypeItems,
                                    valueExpr: 'id',
                                    displayExpr: 'name',
                                    onValueChanged: (e: ValueChangedEvent) =>
                                        changeSelectbox(e),
                                }}
                            />
                            <Item
                                key={`contactId${index}`}
                                dataField={`contacts[${index}].contactId`}
                                label={{ text: 'Contact' }}
                                editorType='dxSelectBox'
                                editorOptions={{
                                    elementAttr: {
                                        id: `contactPerson23456234${index}`,
                                    },
                                    items: contactsData,
                                    valueExpr: 'id',
                                    displayExpr: displayContactFullName,
                                    searchEnabled: true,
                                    onValueChanged: (e: ValueChangedEvent) =>
                                        changeSelectbox(e),
                                }}
                            />
                            <Item
                                key={`contactsShortComment${index}`}
                                dataField={`contacts[${index}].shortComment`}
                                label={{
                                    text: 'Short Comment',
                                }}
                                editorOptions={{
                                    maxLength: 30,
                                }}
                            />
                            <Item>
                                <DeleteItem
                                    data={dataSource}
                                    customKey={`buttonDeleteContact-${index}`}
                                    index={index}
                                    arrayType={'contacts'}
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
                    arrayType={'contacts'}
                    isEditing={isEditing}
                    callbackFunction={callbackFunction}
                />
            </Item>
        </Form>
    );
};

export default ContactsTab;
