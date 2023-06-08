import '@/lib/assets/dx.generic.pg-theme.css';

// Local imports
// import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar'

export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <section className='w-screen min-h-screen bg-custom-white'>
            {/* Sidebar */}
            <aside className='absolute inset-0 w-12 bg-secondary-500 text-custom-white z-10k'>
                <Sidebar />
            </aside>
            {/* Header and page */}
            <section className='absolute inset-0 left-12 flex flex-col'>
                <header className='h-header w-full z-50 shadow-header'>
                    <Header />
                </header>
                <section
                    className='flex flex-col flex-auto justify-between overflow-x-hidden overflow-y-overlay'
                    id='content'
                >
                    {children}
                    {/* <div className='shadow-footer'> <Footer /> </div> */}
                </section>
            </section>
        </section>
    )
}