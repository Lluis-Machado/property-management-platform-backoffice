'use client';
// React imports
import { useCallback, useEffect, useRef, useState } from 'react';
// Libraries imports
import Form, { Item, GroupItem } from 'devextreme-react/form';
import { addressTypeItems } from '@/lib/utils/selectBoxItems';
import { ValueChangedEvent } from 'devextreme/ui/text_box';
import { FieldDataChangedEvent } from 'devextreme/ui/form';
import DataSource from 'devextreme/data/data_source';
import { Locale } from '@/i18n-config';
// Local imports
import { ContactData } from '@/lib/types/contactData';
import { CountryData, StateData } from '@/lib/types/countriesData';
import { TokenRes } from '@/lib/types/token';
import useCountryChange from '@/lib/hooks/useCountryChange';
import { CompanyData } from '@/lib/types/companyData';
import ContactDeleteItem from './TabButtons/ContactDeleteItem';
import ContactAddItem from './TabButtons/ContactAddItem';

interface Props {
    contactData: ContactData;
    countriesData: CountryData[];
    initialStates: StateData[];
    isEditing: boolean;
    isLoading: boolean;
    token: TokenRes;
    lang: Locale;
}

const AddressInformation = ({
    contactData,
    countriesData,
    initialStates,
    isEditing,
    isLoading,
    lang,
    token,
}: Props) => {
    const formRef = useRef<Form>(null);
    const [addressOptions, setAddressOptions] = useState({});
    const [countryDataSource, setCountryDataSource] = useState({});
    const [eventsList, setEventsList] = useState<FieldDataChangedEvent[]>([]);
    const [elementsList, setElementsList] = useState<ValueChangedEvent[]>([]);

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

    useEffect(() => {
        // Set DataSource for DevExtreme select box grouping
        setCountryDataSource(
            new DataSource({
                store: {
                    type: 'array',
                    data: countriesData,
                    key: 'id',
                },
                group: 'category',
            })
        );
    }, [countriesData]);

    const handleCountryChange = useCallback(
        (countryId: number, index: number) => {
            fetch(
                `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/countries/countries/${countryId}/states?languageCode=${lang}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `${token.token_type} ${token.access_token}`,
                    },
                    cache: 'no-store',
                }
            )
                .then((resp) => resp.json())
                .then((data: StateData[]) =>
                    formRef
                        .current!.instance.getEditor(
                            `addresses[${index}].state`
                        )!
                        .option('items', data)
                )
                .catch((e) => console.error('Error while getting the states'));
            // Ensure state is removed
            contactData.addresses[index].state = null;
        },
        [lang, token, contactData.addresses]
    );

    const { getFilteredStates, isStateLoading } = useCountryChange(
        lang,
        token,
        initialStates
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
                {contactData.addresses.map((address, index) => {
                    return (
                        <GroupItem key={`GroupItem-${index}`} colCount={9}>
                            <Item
                                key={`addressType${index}`}
                                dataField={`addresses[${index}].addressType`}
                                label={{ text: 'Address Type' }}
                                editorType='dxSelectBox'
                                editorOptions={{
                                    elementAttr: {
                                        id: `addressType${index}`,
                                    },
                                    items: addressTypeItems,
                                    valueExpr: 'id',
                                    displayExpr: 'name',
                                    onValueChanged: (e: ValueChangedEvent) =>
                                        changeSelectbox(e),
                                }}
                            />
                            <Item
                                key={`addressLine1${index}`}
                                dataField={`addresses[${index}].addressLine1`}
                                label={{ text: 'Address line' }}
                            />
                            <Item
                                key={`addressLine2${index}`}
                                dataField={`addresses[${index}].addressLine2`}
                                label={{
                                    text: 'Address line 2',
                                }}
                            />
                            <Item
                                key={`country${index}`}
                                dataField={`addresses[${index}].country`}
                                label={{ text: 'Country' }}
                                editorType='dxSelectBox'
                                editorOptions={{
                                    elementAttr: {
                                        id: `country${index}`,
                                    },
                                    dataSource: countryDataSource,
                                    displayExpr: 'name',
                                    valueExpr: 'id',
                                    grouped: true,
                                    searchEnabled: true,
                                    onValueChanged: (e: any) => {
                                        handleCountryChange(e.value, index);
                                        changeSelectbox(e);
                                        // Ensure state is removed
                                        contactData.addresses[index].state =
                                            null;
                                    },
                                }}
                            />
                            <Item
                                key={`state${index}`}
                                dataField={`addresses[${index}].state`}
                                label={{ text: 'State' }}
                                editorType='dxSelectBox'
                                editorOptions={{
                                    elementAttr: {
                                        id: `state${index}`,
                                    },
                                    items: getFilteredStates(
                                        index,
                                        contactData
                                    ),
                                    displayExpr: 'name',
                                    valueExpr: 'id',
                                    searchEnabled: true,
                                    readOnly: !isEditing || isStateLoading,
                                    onValueChanged: (e: ValueChangedEvent) =>
                                        changeSelectbox(e),
                                }}
                            />
                            <Item
                                key={`city${index}`}
                                dataField={`addresses[${index}].city`}
                                label={{ text: 'City' }}
                            />
                            <Item
                                key={`postalCode${index}`}
                                dataField={`addresses[${index}].postalCode`}
                                label={{ text: 'Postal code' }}
                            />
                            <Item
                                key={`addressShortComment${index}`}
                                dataField={`addresses[${index}].shortComment`}
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
                                    key={`button${index}`}
                                    index={index}
                                    arrayType={'addresses'}
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
                    isEditing={isEditing}
                    callbackFunction={callbackFunction}
                    arrayType={'addresses'}
                />
            </Item>
        </Form>
    );
};

export default AddressInformation;
