'use client';
// Libraries imports
import Form, { Item } from 'devextreme-react/form';
// Local imports
import { ContactData } from '@/lib/types/contactData';
import { CompanyData } from '@/lib/types/companyData';
import { countriesMaskItems } from '@/lib/utils/selectBoxItems';

interface Props {
    data: ContactData | CompanyData;
    isEditing: boolean;
    callbackFunction: (data: ContactData | CompanyData) => void;
    arrayType: 'identifications' | 'addresses' | 'phones' | 'bankInformation';
}

const ContactAddItem = ({
    data,
    isEditing,
    arrayType,
    callbackFunction,
}: Props) => {
    const addItem = () => {
        switch (arrayType) {
            case 'identifications':
                if ('identifications' in data) {
                    data.identifications.push({
                        type: null,
                        number: '',
                        emissionDate: null,
                        expirationDate: null,
                        shortComment: '',
                    });
                    break;
                }
            case 'addresses':
                data.addresses.push({
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    state: null,
                    country: null,
                    postalCode: '',
                    addressType: null,
                });
                break;
            case 'phones':
                if ('phones' in data) {
                    data.phones.push({
                        phoneType: null,
                        type: null,
                        countryMaskId: countriesMaskItems[0].id,
                        phoneNumber: '',
                        shortComment: '',
                    });
                    break;
                }
            case 'bankInformation':
                data.bankInformation.push({
                    bankName: '',
                    iban: undefined,
                    bic: undefined,
                    contactPerson: undefined,
                });
            default:
                break;
        }
        callbackFunction(data);
    };
    return (
        <Form formData={data}>
            <Item
                itemType='button'
                horizontalAlignment='left'
                buttonOptions={{
                    icon: 'add',
                    text: undefined,
                    disabled: !isEditing,
                    onClick: () => {
                        addItem();
                    },
                }}
            />
        </Form>
    );
};

export default ContactAddItem;
