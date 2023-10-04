'use client';
// React imports
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import Drawer from 'devextreme-react/drawer';
// Local imports
import { Locale } from '@/i18n-config';
import { localeDevExtreme } from '@/lib/utils/datagrid/localeDevExtreme';
import { logOpened } from '@/lib/atoms/logOpened';
import AuditLog from '@/components/auditLog/AuditLog';

interface Props {
    children: React.ReactNode;
    lang: Locale;
}

export function ContentWrapper({ children, lang }: Props) {
    const [isLogOpened, setIsLogOpened] = useAtom(logOpened);

    useEffect(() => {
        localeDevExtreme(lang);
    }, [lang]);

    return (
        <Drawer
            opened={isLogOpened}
            openedStateMode='overlap'
            position='right'
            component={() => <AuditLog />}
            //@ts-ignore bad DevExtreme type
            closeOnOutsideClick={() => setIsLogOpened(false)}
            height={'100%'}
            shading
        >
            <section
                className='h-content-wrapper overflow-y-auto overflow-x-hidden'
                id='content'
            >
                <div className='m-4'>{children}</div>
            </section>
        </Drawer>
    );
}
