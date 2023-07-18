'use client';

import ContactPropertiesDG from '@/components/pages/contacts/ContactPropertiesDG';
import { Locale } from '@/i18n-config';
import { faHouseUser } from '@fortawesome/free-solid-svg-icons';
import { Tabs } from 'pg-components';

interface Props {
    lang: Locale;
}

const ContactsTabs = ({ lang }: Props) => {
    return (
        <Tabs
            dataSource={[
                {
                    title: 'Properties',
                    children: (
                        <ContactPropertiesDG
                            ownershipData={undefined}
                            propertiesData={undefined}
                        />
                    ),
                    icon: faHouseUser,
                },
            ]}
        />
    );
};

export default ContactsTabs;
