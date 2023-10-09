// Local imports
import { Locale } from '@/i18n-config';
import MainLayout from '@/components/layout/MainLayout';

interface Props {
    children: React.ReactNode;
    params: { lang: Locale };
}

const RootLayout = async ({ children, params: { lang } }: Props) => {
    return <MainLayout lang={lang}>{children}</MainLayout>;
};

export default RootLayout;
