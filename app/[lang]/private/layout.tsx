// Local imports
import { Locale } from '@/i18n-config';
import MainLayout from '@/components/layout/MainLayout';
import { getUser } from '@/lib/utils/getUser';

interface Props {
    children: React.ReactNode;
    params: { lang: Locale };
}

const RootLayout = async ({ children, params: { lang } }: Props) => {
    const user = await getUser();

    return (
        <MainLayout lang={lang} user={user}>
            {children}
        </MainLayout>
    );
};

export default RootLayout;
