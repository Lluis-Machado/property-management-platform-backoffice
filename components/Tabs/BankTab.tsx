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
import Popover from 'devextreme-react/popover';
import { Button } from 'pg-components';
import ContactInfoPopover from '../popover/ContactInfoPopover';

interface Props {
    dataSource: ContactData | CompanyData;
    contactsData: ContactData[];
    isEditing: boolean;
    isLoading: boolean;
}
const BankTab = ({ dataSource, contactsData, isEditing, isLoading }: Props) => {
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
        setPopoverTarget(`infoButtonBankContact-${idx}`);
        setIsPopoverVisible(true);
        setSelectedContactInfo(
            contactsData.filter(
                (obj) =>
                    obj.id === dataSource.bankInformation[idx].contactPerson
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

                                <GroupItem
                                    colCount={2}
                                    cssClass='flex flex-start'
                                >
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
                                    <Item
                                        key={`infoButtonBankContact-${index}`}
                                        itemType='button'
                                        horizontalAlignment='left'
                                        verticalAlignment='bottom'
                                        buttonOptions={{
                                            elementAttr: {
                                                id: `infoButtonBankContact-${index}`,
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
                        arrayType={'bankInformation'}
                        isEditing={isEditing}
                        callbackFunction={callbackFunction}
                    />
                </Item>
            </Form>
        </>
    );
};

export default BankTab;
