// Locale imports
import { getDictionary } from '@/lib/utils/dictionaries';
import { Locale } from '@/i18n-config';
import LoginForm from '@/components/forms/LoginForm';

interface Props {
    params: { lang: Locale };
    searchParams: any;
}

const LoginPage = async ({
    params: { lang },
    searchParams,
}: Props): Promise<React.ReactElement> => {
    const dictionary = await getDictionary(lang);

    return (
        <>
            <h2 className='mb-10 text-center text-2xl font-bold leading-9 tracking-tight text-secondary-500'>
                {dictionary.loginPage.title}
            </h2>
            <LoginForm
                dictionary={dictionary.loginPage}
                searchParams={searchParams}
                lang={lang}
            />
        </>
    );
};

export default LoginPage;
