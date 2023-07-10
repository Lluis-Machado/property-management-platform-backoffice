"use client"

// React imports 
import { memo, useCallback, useState } from "react";

// Libraries imports
import { FormikHelpers } from "formik";
import { ApiCallError } from "@/lib/utils/errors";
import { useRouter } from 'next/navigation';
import { ContactData } from "@/lib/types/contactData";
import { toast } from "react-toastify";

//local imports
import { PropertyInterface } from "@/lib/types/propertyInfo";
import { updateErrorToast, updateSuccessToast } from "@/lib/utils/customToasts";
import PropertyFormInfo from "@/components/pages/properties/property/PropertyFormInfo";

interface Props {
  initialValues: PropertyInterface;
  contactData: ContactData[];
}

const AddPropertyPage = ({ initialValues, contactData }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = useCallback(
    async (values: PropertyInterface, { setSubmitting }: FormikHelpers<PropertyInterface>) => {
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
            body: JSON.stringify({
              ...values,
              "ownerships": [
                {
                  "contactId": values.mainContact,
                  "mainOwnership": true,
                  "share": 100
                }
              ],
            }),
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
    <PropertyFormInfo initialValues={initialValues} contactData={contactData} handleSubmit={handleSubmit} isLoading={isLoading} />
  )
}

export default memo(AddPropertyPage);