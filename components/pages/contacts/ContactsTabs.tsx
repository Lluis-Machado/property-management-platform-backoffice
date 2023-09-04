'use client';

import ContactPropertiesDG from '@/components/datagrid/RelatedPropertiesDG';
import { Locale } from '@/i18n-config';
import { OwnershipData } from '@/lib/types/ownershipData';
import { faHouseUser } from '@fortawesome/free-solid-svg-icons';
import { Tabs } from 'pg-components';

interface Props {
    ownershipData: OwnershipData[];
    lang: Locale;
}

const ContactsTabs = ({ ownershipData, lang }: Props) => {
    return (
        <Tabs
            dataSource={[
                {
                    title: 'Properties',
                    children: (
                        <ContactPropertiesDG ownershipData={ownershipData} />
                    ),
                    icon: faHouseUser,
                },
            ]}
        />
    );
};

export default ContactsTabs;
