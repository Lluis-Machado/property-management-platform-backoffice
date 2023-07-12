"use client"

// React imports 
import { memo, useCallback, useState } from "react";

// Libraries imports
import { FormikHelpers } from "formik";
import { ApiCallError } from "@/lib/utils/errors";
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { Formik, Form } from 'formik';
import { Button, Input, Select } from 'pg-components';

//local imports
import { ContactData } from "@/lib/types/contactData";
import { PropertyCreate } from "@/lib/types/propertyInfo";
import { updateErrorToast, updateSuccessToast } from "@/lib/utils/customToasts";
import GroupItem from '@/components/layoutComponent/GroupItem';

interface Props {
  initialValues: PropertyCreate;
  contactData: ContactData[];
}

const AddPropertyPage = ({ initialValues, contactData }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formattedContacts, setFormattedContacts] = useState<{ label: string; value: string }[]>(
    contactData.map(({ firstName, lastName, id }) => {
      return {
        label: `${firstName} ${lastName}`,
        value: `${id}`,
      };
    })
  );

  const router = useRouter();

  const handleSubmit = useCallback(
    async (values: PropertyCreate, { setSubmitting }: FormikHelpers<PropertyCreate>) => {
      console.log("Valores a enviar: ", values)

      if (values === initialValues) {
        toast.warning('Change at least one field')
        return;
      }

      setIsLoading(true)

      const toastId = toast.loading("Creating property...");

      try {

        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/properties/properties`,
          {
            method: 'POST',
            body: JSON.stringify(values),
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
          }
        )

        if (!resp.ok) {
          const responseMsg = await resp.text()
          throw new ApiCallError(responseMsg);
        }
        const data = await resp.json();

        console.log('TODO CORRECTO, valores de vuelta: ', data)

        updateSuccessToast(toastId, "Property created correctly!");
        router.push('/private/properties')

      } catch (error: unknown) {
        console.error(error)
        if (error instanceof ApiCallError) {
          updateErrorToast(toastId, error.message);
        } else {
          updateErrorToast(toastId, "There was an unexpected error, contact admin");
        }
      } finally {
        setIsLoading(false);
        setSubmitting(false);
      }
    }, [router, initialValues]
  )

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <Form>
        <GroupItem caption='Property Information' cols={4}>
          <Input
            name="name"
            label="Name"
            readOnly={isLoading}
          />
          <Input
            name="type"
            label="Type"
            readOnly={isLoading}
          />
          <Input
            name="cadastreRef"
            label="Catastral Reference"
            readOnly={isLoading}
          />
          <Select
            inputsList={formattedContacts}
            name='mainOwnerId'
            label='Main Owner'
            size='large'
            isSearchable
          />
        </GroupItem>
        <GroupItem caption='Address Information' cols={4}>
          <Input
            name="address.addressLine1"
            label="Address line 1"
            readOnly={isLoading}
          />
          <Input
            name="address.addressLine2"
            label="Address line 2"
            readOnly={isLoading}
          />
          <Input
            name="address.postalCode"
            label="Postal Code"
            readOnly={isLoading}
          />
          <Input
            name="address.city"
            label="City"
            readOnly={isLoading}
          />
          <Input
            name="address.state"
            label="State"
            readOnly={isLoading}
          />
          <Input
            name="address.country"
            label="Country"
            readOnly={isLoading}
          />
        </GroupItem>
        <div className='flex justify-end'>
          <div className='flex flex-row justify-between gap-2'>
            <Button
              elevated
              type='submit'
              text='Submit Changes'
              disabled={isLoading}
              isLoading={isLoading}
            />
          </div>
        </div>
      </Form>
    </Formik>
  )
}

export default memo(AddPropertyPage);