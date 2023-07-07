// local imports
import PropertyWrapper from "@/components/pages/properties/property/PropertyWrapper"
import { getApiData } from "@/lib/utils/apiCalls";

interface Props {
  params: { id: string }
}

export default async function Property({ params: {id} }: Props) {
  const data = await getApiData(`/properties/properties/${id}`, 'Error while getting property info')
  const contactData = await getApiData('/contacts/contacts', 'Error while getting contacts');

  return (
    <>
      <div className='text-l text-secondary-500 mb-3'>{`Properties / ${id}/ Property Info`}</div>
      <PropertyWrapper id={id} data={data} contactData={contactData}></PropertyWrapper>
    </>
  )
}