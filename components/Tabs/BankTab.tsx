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
import { FieldDataChangedEvent } from 'devextreme/ui/form';
// Local imports
import { ContactData } from '@/lib/types/contactData';
import { CompanyData } from '@/lib/types/companyData';
import AddItem from './TabButtons/AddItem';
import DeleteItem from './TabButtons/DeleteItem';

export interface BankTabMethods {
    isValid: () => boolean | undefined;
}

interface Props {
    dataSource: ContactData | CompanyData;
    isEditing: boolean;
    isLoading: boolean;
}
const BankTab = forwardRef<BankTabMethods, Props>((props, ref) => {
    const { dataSource, isEditing, isLoading } = props;
    const [addressOptions, setAddressOptions] = useState({});
    const [eventsList, setEventsList] = useState<FieldDataChangedEvent[]>([]);
    const formRef = useRef<Form>(null);

    useImperativeHandle(ref, () => ({
        isValid,
    }));

    useEffect(() => {
        for (const event of eventsList) {
            document
                .getElementsByName(event.dataField!)[0]
                ?.classList.add('styling');
        }
    }, [eventsList, addressOptions]);

    const isValid = () => {
        if (dataSource.bankInformation.length === 0) return true;
        return formRef.current!.instance.validate().isValid;
    };

    const changeCssFormElement = (e: FieldDataChangedEvent) => {
        if (e.dataField !== 'formData') {
            setEventsList((prev) => [...prev, e]);
        }
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
            <Form
                formData={dataSource}
                ref={formRef}
                labelMode={'floating'}
                readOnly={isLoading || !isEditing}
                onFieldDataChanged={changeCssFormElement}
            >
                <GroupItem colCount={1}>
                    {dataSource.bankInformation.map((_, index) => {
                        return (
                            <GroupItem key={`GroupItem4-${index}`} colCount={7}>
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
                                >
                                    <RequiredRule />
                                </Item>
                                <Item
                                    key={`bic${index}`}
                                    dataField={`bankInformation[${index}].bic`}
                                    label={{
                                        text: 'BIC',
                                    }}
                                />
                                <Item
                                    key={`contactName${index}`}
                                    dataField={`bankInformation[${index}].contactName`}
                                    label={{
                                        text: 'Contact Name',
                                    }}
                                />
                                <Item
                                    key={`contactPhone${index}`}
                                    dataField={`bankInformation[${index}].contactPhone`}
                                    label={{
                                        text: 'Contact Phone',
                                    }}
                                />
                                <Item
                                    key={`contactEmail${index}`}
                                    dataField={`bankInformation[${index}].contactEmail`}
                                    label={{
                                        text: 'Contact Email',
                                    }}
                                />

                                <GroupItem
                                    colCount={1}
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
});

export default memo(BankTab);
