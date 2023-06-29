// React imports
import { FC, memo } from 'react';
// Local imports
import { Locale } from '@/i18n-config';
import { Sidebar } from './Sidebar';
import Header from './Header';

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
                <section
                    className='flex m-2 flex-col flex-auto justify-start overflow-hidden'
                    id='content'
                >
                    {children}
                    {/* <div className='shadow-footer'> <Footer /> </div> */}
                </section>
            </section>
        </section>
    );
});

export default MainLayout;