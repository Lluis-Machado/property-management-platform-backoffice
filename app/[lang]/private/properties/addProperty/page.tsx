// Local imports
import AddPropertyPage from '@/components/pages/properties/property/addPropertyPage';
import { CreatePropertyInterface } from '@/lib/types/propertyInfo';

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

const AddProperty = async (): Promise<React.ReactElement> => {
    return (
        <>
            <AddPropertyPage initialValues={initialValues} />
        </>
    )
};

export default AddProperty

