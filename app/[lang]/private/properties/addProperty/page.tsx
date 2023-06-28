//local imports
import PropertyFormInfo from "@/components/forms/propertyFormInfo/PropertyFormInfo"
import { PropertyFormInterface } from '@/lib/types/propertyInfo';

const page = (): React.ReactElement => {
  const initialValues: PropertyFormInterface = {
    name: '',
    type: '',
    catastralRef: '',
    mainContact: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  };
  return (
    <>
      <div className='text-l text-secondary-500 mb-3'>{`Properties / add Property`}</div>
      <PropertyFormInfo initialValues={initialValues}/>
    </>
  )
}

export default page