'use client';
// Libraries imports
import Form, { Item } from 'devextreme-react/form';
// Local imports
import { CompanyData } from '@/lib/types/companyData';
import { ContactData } from '@/lib/types/contactData';

interface Props {
    data: ContactData | CompanyData;
    key: string;
    arrayType: 'identifications' | 'addresses' | 'phones' | 'bankInformation';
    index: number;
    isEditing: boolean;
    callbackFunction: (data: ContactData | CompanyData) => void;
}

const ContactDeleteItem = ({
    data,
    key,
    index,
    isEditing,
    callbackFunction,
    arrayType,
}: Props): JSX.Element => {
    const deleteItem = (index: number) => {
        switch (arrayType) {
            case 'identifications':
                if ('identifications' in data) {
                    data.identifications.splice(index, 1);
                    break;
                }
            case 'addresses':
                data.addresses.splice(index, 1);
            case 'phones':
                if ('phones' in data) {
                    data.phones.splice(index, 1);
                }
            case 'bankInformation':
                data.bankInformation.splice(index, 1);
            default:
                break;
        }
        callbackFunction(data);
    };
    return (
        <Form formData={data}>
            <Item
                key={key}
                itemType='button'
                horizontalAlignment='left'
                verticalAlignment='top'
                buttonOptions={{
                    icon: 'trash',
                    text: undefined,
                    disabled: !isEditing,
                    type: 'danger',
                    onClick: () => deleteItem(index),
                }}
            />
        </Form>
    );
};

export default ContactDeleteItem;
