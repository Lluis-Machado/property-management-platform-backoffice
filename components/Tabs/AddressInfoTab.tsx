'use client';
// React imports
import {
    forwardRef,
    memo,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
// Libraries imports
import Form, { Item, GroupItem, RequiredRule } from 'devextreme-react/form';
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
import DeleteItem from './TabButtons/DeleteItem';
import AddItem from './TabButtons/AddItem';

export interface AddressInfoTabMethods {
    isValid: () => boolean | undefined;
}

interface Props {
    dataSource: ContactData | CompanyData;
    countriesData: CountryData[];
    initialStates: StateData[];
    isEditing: boolean;
    isLoading: boolean;
    token: TokenRes;
    lang: Locale;
}

const AddressInfoTab = forwardRef<AddressInfoTabMethods, Props>(
    (props, ref) => {
        const {
            dataSource,
            countriesData,
            initialStates,
            isEditing,
            isLoading,
            lang,
            token,
        } = props;
        const formRef = useRef<Form>(null);
        const [addressOptions, setAddressOptions] = useState({});
        const [countryDataSource, setCountryDataSource] = useState({});
        const [eventsList, setEventsList] = useState<FieldDataChangedEvent[]>(
            []
        );
        const [elementsList, setElementsList] = useState<ValueChangedEvent[]>(
            []
        );

        const { handleCountryChange, getFilteredStates, isStateLoading } =
            useCountryChange(lang, token, initialStates);

        useImperativeHandle(ref, () => ({
            isValid,
        }));

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
        }, [eventsList, elementsList, addressOptions, isStateLoading]);

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

        const isValid = () => {
            if (dataSource.addresses.length === 0) return true;
            return formRef.current!.instance.validate().isValid;
        };

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
                onFieldDataChanged={changeCssFormElement}
            >
                <GroupItem colCount={1}>
                    {dataSource.addresses.map((address, index) => {
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
                                        onValueChanged: (
                                            e: ValueChangedEvent
                                        ) => changeSelectbox(e),
                                    }}
                                />
                                <Item
                                    key={`addressLine1${index}`}
                                    dataField={`addresses[${index}].addressLine1`}
                                    label={{ text: 'Address line' }}
                                >
                                    <RequiredRule />
                                </Item>
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
                                            handleCountryChange(e.value);
                                            changeSelectbox(e);
                                            // Ensure state is removed
                                            dataSource.addresses[index].state =
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
                                            dataSource
                                        ),
                                        displayExpr: 'name',
                                        valueExpr: 'id',
                                        searchEnabled: true,
                                        readOnly: !isEditing || isStateLoading,
                                        onValueChanged: (
                                            e: ValueChangedEvent
                                        ) => changeSelectbox(e),
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
                                        maxLength: 20,
                                    }}
                                />
                                <Item>
                                    <DeleteItem
                                        data={dataSource}
                                        customKey={`button${index}`}
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
                    <AddItem
                        data={dataSource}
                        isEditing={isEditing}
                        callbackFunction={callbackFunction}
                        arrayType={'addresses'}
                    />
                </Item>
            </Form>
        );
    }
);

export default memo(AddressInfoTab);
