'use client'

import { memo, useCallback, useState } from 'react';
// Libraries imports
import { useRouter } from 'next/navigation';
import { Button } from 'pg-components';
import { toast } from 'react-toastify';
import Form, {
    GroupItem, Item
} from 'devextreme-react/form';

// Local imports
import { ApiCallError } from '@/lib/utils/errors';
import { ContactData } from '@/lib/types/contactData';
import { updateErrorToast, updateSuccessToast } from '@/lib/utils/customToasts';
import { dateFormat } from '@/lib/utils/datagrid/customFormats';
import { Locale } from '@/i18n-config';
import { TokenRes } from '@/lib/types/token';
import { SelectData } from '@/lib/types/selectData';

interface Props {
    contactData: ContactData;
    countries: SelectData[];
    token: TokenRes;
    lang: Locale;
}

const AddContactPage = ({ contactData, countries, token, lang }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [states, setStates] = useState<SelectData[] | undefined>(undefined);
    // Importante para que no se copie por referencia
    const [initialValues, setInitialValues] = useState<ContactData>(structuredClone(contactData));

    const router = useRouter();

    const handleCountryChange = useCallback((countryId: number) => {
        fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/countries/countries/${countryId}/states?languageCode=${lang}`, {
            method: 'GET',
            headers: {
                'Authorization': `${token.token_type} ${token.access_token}`,
            },
            cache: 'no-store'
        })
            .then((resp) => resp.json())
            .then((data: any) => {
                let states = [];
                for (const state of data) {
                    states.push({
                        label: state.name,
                        value: state.id
                    })
                }
                setStates(states)
            })
            .catch((e) => console.error('Error while getting the states'))
    }, [lang, token])

    const handleSubmit = useCallback(
        async () => {
            const values = contactData;
            console.log("Valores a enviar: ", values)
            console.log("Valores a enviar en JSON: ", JSON.stringify(values))

            if (JSON.stringify(values) === JSON.stringify(initialValues)) {
                toast.warning('Change at least one field')
                return;
            }

            setIsLoading(true)

            const toastId = toast.loading("Creating contact...");

            try {
                const resp = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/contacts/contacts`,
                    {
                        method: 'POST',
                        body: JSON.stringify(values),
                        headers: { 'Content-type': 'application/json; charset=UTF-8' }
                    }
                );

                if (!resp.ok) {
                    const responseMsg = await resp.text()
                    throw new ApiCallError(responseMsg);
                }
                const data = await resp.json();

                console.log('TODO CORRECTO, valores de vuelta: ', data);

                updateSuccessToast(toastId, "Contact created correctly!");
                router.push('/private/contacts')

            } catch (error: unknown) {
                console.error(error)
                if (error instanceof ApiCallError) {
                    updateErrorToast(toastId, error.message);
                } else {
                    updateErrorToast(toastId, "There was an unexpected error, contact admin");
                }
            } finally {
                setIsLoading(false);
            }
        }, [router]
    )

    return (
        <div>
            <Form
                formData={contactData}
                labelMode={'floating'}
                readOnly={isLoading}
            >
                <GroupItem colCount={4} caption="Contact Information">
                    <Item dataField="firstName" label={{ text: "First name" }} />
                    <Item dataField="lastName" label={{ text: "Last name" }} />
                    <Item
                        dataField="birthDay"
                        label={{ text: 'Birth date' }}
                        editorType='dxDateBox'
                        editorOptions={{
                            displayFormat: dateFormat,
                            showClearButton: true
                        }}
                    />
                    <Item dataField="nif" label={{ text: "NIF" }} />
                </GroupItem>
                <GroupItem colCount={4} caption="Address Information">
                    <Item dataField="address.addressLine1" label={{ text: "Address line" }} />
                    <Item dataField="address.addressLine2" label={{ text: "Address line 2" }} />
                    <Item
                        dataField="address.country"
                        label={{ text: "Country" }}
                        editorType='dxSelectBox'
                        editorOptions={{
                            items: countries,
                            displayExpr: "label",
                            valueExpr: "value",
                            searchEnabled: true,
                            onValueChanged: (e: any) => handleCountryChange(e.value)
                        }}
                    />
                    <Item
                        dataField="address.state"
                        label={{ text: "State" }}
                        editorType='dxSelectBox'
                        editorOptions={{
                            items: states,
                            displayExpr: "label",
                            valueExpr: "value",
                            searchEnabled: true
                        }}
                    />
                    <Item dataField="address.city" label={{ text: "City" }} />
                    <Item dataField="address.postalCode" label={{ text: "Postal code" }} />
                    <Item dataField="email" label={{ text: "Email" }} />
                    <Item dataField="phoneNumber" label={{ text: "Phone number" }} />
                    <Item dataField="mobilePhoneNumber" label={{ text: "Mobile phone number" }} />
                </GroupItem>
            </Form>
            <div className='h-[2rem]'>
                <div className='flex justify-end'>
                    <div className='flex flex-row justify-between gap-2'>
                        <Button
                            elevated
                            type='button'
                            text='Submit Changes'
                            disabled={isLoading}
                            isLoading={isLoading}
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(AddContactPage);