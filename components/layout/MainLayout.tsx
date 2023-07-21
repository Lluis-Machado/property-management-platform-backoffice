// React imports
import { memo } from 'react';
import { ToastContainer } from 'react-toastify';

// Local imports
import { ContentWrapper } from './ContentWrapper';
import { Locale } from '@/i18n-config';
import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';
import { User } from '@/lib/types/user';

interface Props {
    children: React.ReactNode;
    lang: Locale;
    user: User;
}

function MainLayout({ children, lang, user }: Props) {
    return (
        <section className='min-h-screen w-screen bg-white'>
            {/* Sidebar */}
            <aside className='absolute inset-0 z-10k w-12 bg-secondary-500 text-custom-white'>
                <Sidebar />
            </aside>
            {/* Header and page */}
            <section className='absolute inset-0 left-12 flex flex-col'>
                <header className='z-50 h-header w-full shadow-header'>
                    <Header lang={lang} user={user} />
                </header>
                <ContentWrapper lang={lang}>{children}</ContentWrapper>
            </section>
            <ToastContainer />
        </section>
    );
}

export default memo(MainLayout);
