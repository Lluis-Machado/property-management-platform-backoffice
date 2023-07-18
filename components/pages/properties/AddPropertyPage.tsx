"use client"

// React imports 
import { memo, useCallback, useState } from "react";

// Libraries imports
import { ApiCallError } from "@/lib/utils/errors";
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { Button } from 'pg-components';
import Form, {
  GroupItem, Item
} from 'devextreme-react/form';

//local imports
import { PropertyCreate } from "@/lib/types/propertyInfo";
import { updateErrorToast, updateSuccessToast } from "@/lib/utils/customToasts";
import { TokenRes } from "@/lib/types/token";
import { Locale } from "@/i18n-config";
import { SelectData } from "@/lib/types/selectData";
import { customError } from "@/lib/utils/customError";
import { apiPost } from "@/lib/utils/apiPost";

interface Props {
  propertyData: PropertyCreate;
  contacts: SelectData[];
  countries: SelectData[];
  token: TokenRes;
  lang: Locale;
}

const AddPropertyPage = ({ propertyData, contacts, countries, token, lang }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [states, setStates] = useState<SelectData[] | undefined>(undefined);
  // Importante para que no se copie por referencia
  const [initialValues, setInitialValues] = useState<PropertyCreate>(structuredClone(propertyData));

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
      const values = structuredClone(propertyData);

      console.log("Valores a enviar: ", values)

      if (JSON.stringify(values) === JSON.stringify(initialValues)) {
        toast.warning('Change at least one field')
        return;
      }

      setIsLoading(true)

      const toastId = toast.loading("Creating property...");

      try {
        const data = await apiPost('/properties/properties', values, token, 'Error while creating a property')

        console.log('TODO CORRECTO, valores de vuelta: ', data)

        updateSuccessToast(toastId, "Property created correctly!");
        router.push('/private/properties')

      } catch (error: unknown) {
        customError(error, toastId);
      } finally {
        setIsLoading(false);
      }
    }, [router, propertyData, initialValues]
  )

  return (
    <div>
      <Form
        formData={propertyData}
        labelMode={'floating'}
        readOnly={isLoading}
      >
        <GroupItem colCount={4} caption="Property Information">
          <Item dataField="name" label={{ text: "Name" }} />
          <Item dataField="type" label={{ text: "Type" }} />
          <Item dataField="cadastreRef" label={{ text: "Catastral Reference" }} />
          <Item
            dataField="mainOwnerId"
            label={{ text: "Main Owner" }}
            editorType='dxSelectBox'
            editorOptions={{
              items: contacts,
              displayExpr: "label",
              valueExpr: "value",
              searchEnabled: true
            }}
          />
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
  )
}

export default memo(AddPropertyPage);