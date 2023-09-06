'use client';
// React imports
import { memo, useCallback, useEffect, useRef, useState } from 'react';
// Libraries imports
import Form, { Item, GroupItem } from 'devextreme-react/form';
import { ValueChangedEvent } from 'devextreme/ui/text_box';
import { FieldDataChangedEvent } from 'devextreme/ui/form';
import { Popover, Position } from 'devextreme-react/popover';
// Local imports
import { ContactData } from '@/lib/types/contactData';
import { CompanyData } from '@/lib/types/companyData';
import AddItem from './TabButtons/AddItem';
import DeleteItem from './TabButtons/DeleteItem';
import { displayContactFullName } from '@/lib/utils/displayContactFullName';
import { companyContactsTypeItems } from '@/lib/utils/selectBoxItems';
import { Button } from 'pg-components';
import ContactInfoPopover from '../popover/ContactInfoPopover';

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
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);
    const [popoverTarget, setPopoverTarget] = useState('');
    const [selectedContactInfo, setSelectedContactInfo] =
        useState<ContactData>();
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

    const handlePopover = (idx: number) => {
        setPopoverTarget(`infoButtonContact-${idx}`);
        setIsPopoverVisible(true);
        setSelectedContactInfo(
            contactsData.filter(
                (obj) => obj.id === dataSource.contacts[idx].contactId
            )[0]
        );
    };

    const callbackFunction = useCallback(
        (dataSource: ContactData | CompanyData) => {
            formRef.current?.instance.updateData('formData', dataSource);
            setAddressOptions([]);
        },
        []
    );
    return (
        <>
            <ContactInfoPopover
                popoverTarget={popoverTarget}
                isPopoverVisible={isPopoverVisible}
                selectedContactInfo={selectedContactInfo!}
                onHidden={() => setIsPopoverVisible(false)}
            />
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
                                        onValueChanged: (
                                            e: ValueChangedEvent
                                        ) => changeSelectbox(e),
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
                                        onValueChanged: (
                                            e: ValueChangedEvent
                                        ) => changeSelectbox(e),
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
                                <GroupItem
                                    colCount={2}
                                    cssClass='flex flex-start'
                                >
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
                                    <Item
                                        key={`infoButtonContact-${index}`}
                                        itemType='button'
                                        horizontalAlignment='left'
                                        verticalAlignment='bottom'
                                        buttonOptions={{
                                            elementAttr: {
                                                id: `infoButtonContact-${index}`,
                                            },
                                            icon: 'info',
                                            text: undefined,
                                            disabled: false,
                                            type: 'default',
                                            onClick: () => handlePopover(index),
                                        }}
                                    />
                                </GroupItem>
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
        </>
    );
};

export default memo(ContactsTab);
