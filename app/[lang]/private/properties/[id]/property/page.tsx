// local imports
import PropertyPage from "@/components/pages/properties/property/PropertyPage"
import { getApiData } from "@/lib/utils/apiCalls";

interface Props {
  params: { id: string }
}

const Property = async ({ params: { id } }: Props) => {
  const data = await getApiData(`/properties/properties/${id}`, 'Error while getting property info')
  const contactData = await getApiData('/contacts/contacts', 'Error while getting contacts');

  return (
    <>
      <div className='text-lg text-secondary-500'>
        Properties / Property Info
      </div>
      <PropertyPage id={id} initialValues={data} contactData={contactData} />
    </>
  )
}

export default Property