import LoginForm from '@/components/forms/LoginForm';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/lib/utils/dictionaries';

interface Props {
  searchParams: any
  params: { lang: Locale }
}

const LoginPage = async ({ searchParams, params: { lang } }: Props) => {
  const dictionary = await getDictionary(lang);

  return (
    <>
      <h2 className="mb-10 text-center text-2xl font-bold leading-9 tracking-tight text-secondary-500">
        {dictionary.loginPage.title}
      </h2>
      <LoginForm dictionary={dictionary.loginPage} searchParams={searchParams} />
    </>
  )
}

export default LoginPage