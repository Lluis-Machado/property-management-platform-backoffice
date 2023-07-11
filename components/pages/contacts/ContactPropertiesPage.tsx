import { Locale } from '@/i18n-config';
import { getApiData } from '@/lib/utils/getApiData';
import ContactPropertiesDG from './ContactPropertiesDG';

interface Props {
  lang: Locale;
  id: string;
};

const ContactPropertiesPage = async ({ id }: Props) => {
  const properties = await getApiData(`/properties/properties`, 'Error while getting properties info');
  const ownerships = await getApiData(`/ownership/ownership`, 'Error while getting ownerships info');

  const filteredOwnerships = ownerships.filter((obj: any) => obj.contactId === id);

  return (
    <ContactPropertiesDG ownershipData={filteredOwnerships} propertiesData={properties} />
  )
}

export default ContactPropertiesPage