// Local imports
import '@/lib/assets/dx.generic.pg-theme.css';
import { Locale } from '@/i18n-config';
import MainLayout from '@/components/layout/MainLayout';

interface Props {
    children: React.ReactNode;
    params: { lang: Locale };
};

export default function RootLayout({ children, params: { lang } }: Props): React.ReactElement {
    return (
        <MainLayout lang={lang}>
            {children}
        </MainLayout>
    );
};