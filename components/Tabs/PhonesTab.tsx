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
import {
    countriesMaskItems,
    phoneType2Items,
    phoneTypeItems,
} from '@/lib/utils/selectBoxItems';
import { ValueChangedEvent } from 'devextreme/ui/text_box';
import { FieldDataChangedEvent } from 'devextreme/ui/form';
// Local imports
import { ContactData } from '@/lib/types/contactData';
import { CompanyData } from '@/lib/types/companyData';
import AddItem from './TabButtons/AddItem';
import DeleteItem from './TabButtons/DeleteItem';

export interface PhonesTabMethods {
    isValid: () => boolean | undefined;
}

interface Props {
    contactData: ContactData;
    isEditing: boolean;
    isLoading: boolean;
}

const PhonesTab = forwardRef<PhonesTabMethods, Props>((props, ref) => {
    const { contactData, isEditing, isLoading } = props;
    const [addressOptions, setAddressOptions] = useState({});
    const [eventsList, setEventsList] = useState<FieldDataChangedEvent[]>([]);
    const [elementsList, setElementsList] = useState<ValueChangedEvent[]>([]);
    const formRef = useRef<Form>(null);

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
    }, [eventsList, elementsList, addressOptions]);

    const isValid = () => {
        if (contactData.phones.length === 0) return true;
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
        (contactData: ContactData | CompanyData) => {
            formRef.current?.instance.updateData('formData', contactData);
            setAddressOptions([]);
        },
        []
    );

    const getMaskFromDataSource = (index: number) =>
        countriesMaskItems.filter(
            (obj) => obj.id === contactData.phones[index].countryMaskId
        )[0]?.mask || countriesMaskItems[0].mask;

    const getMaskValueChange = (e: ValueChangedEvent, index: number) => {
        const result = countriesMaskItems.filter((obj) => obj.id === e.value);
        formRef
            .current!.instance.getEditor(`phones[${index}].phoneNumber`)!
            .option('mask', result[index].mask);
    };
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
                {contactData.phones.map((phone, index) => {
                    return (
                        <GroupItem key={`GroupItem2-${index}`} colCount={6}>
                            <Item
                                key={`phoneType${index}`}
                                dataField={`phones[${index}].phoneType`}
                                label={{ text: 'Phone Type' }}
                                editorType='dxSelectBox'
                                editorOptions={{
                                    elementAttr: {
                                        id: `phoneType${index}`,
                                    },
                                    items: phoneTypeItems,
                                    valueExpr: 'id',
                                    displayExpr: 'name',
                                    onValueChanged: (e: ValueChangedEvent) =>
                                        changeSelectbox(e),
                                }}
                            >
                                <RequiredRule />
                            </Item>
                            <Item
                                key={`type${index}`}
                                dataField={`phones[${index}].type`}
                                label={{ text: 'Type' }}
                                editorType='dxSelectBox'
                                editorOptions={{
                                    elementAttr: {
                                        id: `typePhone${index}`,
                                    },
                                    items: phoneType2Items,
                                    valueExpr: 'id',
                                    displayExpr: 'name',
                                    onValueChanged: (e: ValueChangedEvent) =>
                                        changeSelectbox(e),
                                }}
                            >
                                <RequiredRule />
                            </Item>
                            <Item
                                key={`countryMaskId${index}`}
                                dataField={`phones[${index}].countryMaskId`}
                                label={{ text: 'Country' }}
                                editorType='dxSelectBox'
                                editorOptions={{
                                    elementAttr: {
                                        id: `countryMaskId${index}`,
                                    },
                                    items: countriesMaskItems,
                                    valueExpr: 'id',
                                    displayExpr: 'name',
                                    defaultValue: countriesMaskItems[0],
                                    onValueChanged: (e: ValueChangedEvent) => {
                                        getMaskValueChange(e, index);
                                        changeSelectbox(e);
                                    },
                                }}
                            >
                                <RequiredRule />
                            </Item>
                            <Item
                                key={`phoneNumber${index}`}
                                dataField={`phones[${index}].phoneNumber`}
                                label={{ text: 'Phone Number' }}
                                editorOptions={{
                                    elementAttr: {
                                        id: `phoneNumber${index}`,
                                    },
                                    mask: getMaskFromDataSource(index),
                                    useMaskedValue: true,
                                    onValueChanged: (e: ValueChangedEvent) =>
                                        changeSelectbox(e),
                                }}
                            >
                                <RequiredRule />
                            </Item>
                            <Item
                                key={`phoneShortComment${index}`}
                                dataField={`phones[${index}].shortComment`}
                                label={{
                                    text: 'Short Comment',
                                }}
                                editorOptions={{
                                    maxLength: 30,
                                }}
                            />
                            <Item>
                                <DeleteItem
                                    customKey={`button2-${index}`}
                                    data={contactData}
                                    index={index}
                                    arrayType={'phones'}
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
                    data={contactData}
                    arrayType={'phones'}
                    isEditing={isEditing}
                    callbackFunction={callbackFunction}
                />
            </Item>
        </Form>
    );
});

export default memo(PhonesTab);
