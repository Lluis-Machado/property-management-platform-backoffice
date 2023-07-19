'use client';

// React imports
import { useEffect } from 'react';

// Local imports
import { Locale } from '@/i18n-config';
import { localeDevExtreme } from '@/lib/utils/datagrid/localeDevExtreme';

interface Props {
    children: React.ReactNode;
    lang: Locale;
}

export function ContentWrapper({ children, lang }: Props) {
    useEffect(() => {
        localeDevExtreme(lang);
    }, [lang]);

    return (
        <section className='h-full overflow-x-hidden' id='content'>
            <div className='m-4'>{children}</div>
        </section>
    );
}
