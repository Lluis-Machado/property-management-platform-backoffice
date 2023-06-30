// React imports
import { FC, memo } from 'react';

// Local imports
import { ContentWrapper } from './ContentWrapper';
import { Locale } from '@/i18n-config';
import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';

interface Props {
    children: React.ReactNode,
    lang: Locale
};

const MainLayout: FC<Props> = memo(function MainLayout({ children, lang }) {
    return (
        <section className='w-screen min-h-screen bg-white'>
            {/* Sidebar */}
            <aside className='absolute inset-0 w-12 bg-secondary-500 text-custom-white z-10k'>
                <Sidebar />
            </aside>
            {/* Header and page */}
            <section className='absolute inset-0 left-12 flex flex-col'>
                <header className='h-header w-full z-50 shadow-header'>
                    <Header lang={lang} />
                </header>
                <ContentWrapper lang={lang}>
                    {children}
                </ContentWrapper>
            </section>
        </section>
    );
});

export default MainLayout;