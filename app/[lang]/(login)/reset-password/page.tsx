import ResetPasswordForm from '@/components/forms/ResetPasswordForm';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/lib/utils/dictionaries';

interface Props {
  searchParams: any
  params: { lang: Locale }
}

const ResetPassPage = async ({ searchParams, params: { lang } }: Props) => {
  const dictionary = await getDictionary(lang);

  return (
    <>
      <h2 className="mb-10 text-center text-2xl font-bold leading-9 tracking-tight text-secondary-500">
        {dictionary.resetPasswordPage.title}
      </h2>
      <ResetPasswordForm dictionary={dictionary.resetPasswordPage} searchParams={searchParams} />
    </>
  )
}

export default ResetPassPage