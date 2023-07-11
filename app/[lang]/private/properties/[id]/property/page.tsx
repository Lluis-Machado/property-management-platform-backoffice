// local imports
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import PropertyPage from "@/components/pages/properties/property/PropertyPage"
import { getApiData } from "@/lib/utils/getApiData";

interface Props {
  params: { id: string }
}

const Property = async ({ params: { id } }: Props) => {
  const data = await getApiData(`/properties/properties/${id}`, 'Error while getting property info')
  const contactData = await getApiData('/contacts/contacts', 'Error while getting contacts');

  return (
    <>
      <Breadcrumb />
      <PropertyPage id={id} initialValues={data} contactData={contactData} />
    </>
  )
}

export default Property