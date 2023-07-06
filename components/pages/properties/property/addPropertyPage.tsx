"use client"
//react imports 
import { memo, useCallback, useState } from "react"; 3
//local imports
import { PropertyInterface } from "@/lib/types/propertyInfo";
import { FormikHelpers } from "formik";
import PropertyFormInfo from "@/components/forms/propertyFormInfo/PropertyFormInfo";
import { AlertConfig } from "../../contacts/ContactPage";
import { ApiCallError } from "@/lib/utils/errors";
import { useRouter } from 'next/navigation';
import { Alert } from "pg-components";
import { ContactData } from "@/lib/types/contactData";

interface Props {
  initialValues: PropertyInterface;
  contactData: ContactData[];
}
const AddPropertyPage = ({ initialValues, contactData }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    isVisible: false,
    type: 'info',
    message: '',
  });

  const router = useRouter();

  const handleSubmit = useCallback(
    async (values: PropertyInterface, { setSubmitting }: FormikHelpers<PropertyInterface>) => {
      console.log("Valores a enviar: ", values)

      if (values === initialValues) {
        setAlertConfig({
          isVisible: true,
          type: 'warning',
          message: 'Change at least one field'
        })
        return;
      }

      setIsLoading(true)

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

        if (!resp.ok) throw new ApiCallError('Error while updating a property');
        const data = await resp.json();

        console.log('TODO CORRECTO, valores de vuelta: ', data)

        setAlertConfig({
          isVisible: true,
          type: 'success',
          message: 'Property added succesfully!'
        })

        router.push('/private/properties/')
      } catch (error) {
        console.error(error)
        setAlertConfig({
          isVisible: true,
          type: 'danger',
          message: 'CHECK CONSOLE'
        })
      } finally {
        setIsLoading(false);
        setSubmitting(false);
      }
    }, [router, initialValues]
  )
  const onAlertHiding = useCallback(
    () => {
      setAlertConfig({
        ...alertConfig,
        isVisible: false,
      });
    }, [alertConfig]
  )
  return (
    <>
      <div className='absolute right-8'>
        <Alert
          body={alertConfig.message}
          isVisible={alertConfig.isVisible}
          onHidden={onAlertHiding}
          type={alertConfig.type}
          duration={3000}
        />
      </div>
      <div className='text-l text-secondary-500 mb-3'>{`Properties / add Property`}</div>
      <PropertyFormInfo initialValues={initialValues} contactData={contactData} handleSubmit={handleSubmit} isLoading={isLoading} />
    </>
  )
}

export default memo(AddPropertyPage);