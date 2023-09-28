'use client';

import ContactPropertiesDG from '@/components/datagrid/RelatedPropertiesDG';
import { Locale } from '@/i18n-config';
import { OwnershipPropertyData } from '@/lib/types/ownershipProperty';
import { faHouseUser } from '@fortawesome/free-solid-svg-icons';
import { Tabs } from 'pg-components';

interface Props {
    ownershipData: OwnershipPropertyData[];
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
