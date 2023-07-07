'use client'

// React imports
import { FC, memo, useEffect } from 'react';

// Local imports
import { Locale } from '@/i18n-config';
import { localeDevExtreme } from '@/lib/utils/datagrid/localeDevExtreme';

interface Props {
    children: React.ReactNode;
    lang: Locale
};

export const ContentWrapper: FC<Props> = memo(function ContentWrapper({ children, lang }) {

    useEffect(() => {
        localeDevExtreme(lang);
    }, [lang]);

    return (
        <section className='overflow-x-hidden' id='content'>
            <div className='m-4'>
                {children}
            </div>
        </section>
    );
});
