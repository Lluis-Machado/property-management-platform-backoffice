import ContactsTabs from '@/components/pages/contacts/ContactsTabs';
import { Locale } from '@/i18n-config';
import { OwnershipData } from '@/lib/types/ownershipData';
import { getApiData } from '@/lib/utils/getApiData';

interface Props {
    params: { lang: Locale; id: string };
}

const ContactTabs = async ({ params: { lang, id } }: Props) => {
    const ownershipData = await getApiData<OwnershipData[]>(
        `/ownership/ownership/${id}/contact`,
        'Error while getting ownership info'
    );

    return <ContactsTabs lang={lang} ownershipData={ownershipData} />;
};

export default ContactTabs;
