"use client"
//local imports
import PropertyFormInfo from "@/components/forms/propertyFormInfo/PropertyFormInfo"
import { CreatePropertyInterface } from "@/lib/types/propertyInfo";
import { FormikHelpers } from "formik";

const page = (): React.ReactElement => {

  const handleSubmit = async (
    values: CreatePropertyInterface,
    { setSubmitting }: FormikHelpers<CreatePropertyInterface>
  ) => {
    const res = await fetch('https://stage.plattesapis.net/properties/properties', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({
        ...values,
        "typeOfUse": [
          0
        ],
        "comments": "",
        //SEE HOW TO GET THE CONTACT ID FROM MAIN CONTACT
        "ownerships": [
          {
            "contactId": "615a6923-f207-4872-a0fc-039cd4faf5f1",
            "mainOwnership": true,
            "share": 100
          }
        ]
      }),
    })
    // SHOW CONFIRMATION SUBMIT
    await res.json();
    setSubmitting(false);
  };

  const initialValues: CreatePropertyInterface = {
    name: "",
    type: "",
    typeOfUse: [
        0
    ],
    address: {
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: ""
    },
    cadastreRef: "",
    ownerships: [
        {
            id: "",
            contactId: "",
            mainOwnership: true,
            share: 0
        }
    ]
  };
  return (
    <>
      <div className='text-l text-secondary-500 mb-3'>{`Properties / add Property`}</div>
      <PropertyFormInfo initialValues={initialValues} handleSubmit={handleSubmit} />
    </>
  )
}

export default page