// Local imports
import { getDictionary } from '@/lib/utils/dictionaries';
import { Locale } from '@/i18n-config';
import ResetPasswordForm from '@/components/forms/ResetPasswordForm';

interface Props {
  searchParams: any;
  params: { lang: Locale };
};

const ResetPasswordPage = async ({ searchParams, params: { lang } }: Props): Promise<React.ReactElement> => {
  const dictionary = await getDictionary(lang);

  return (
    <>
      <h2 className='mb-10 text-center text-2xl font-bold leading-9 tracking-tight text-secondary-500'>
        {dictionary.resetPasswordPage.title}
      </h2>
      <ResetPasswordForm dictionary={dictionary.resetPasswordPage} searchParams={searchParams} />
    </>
  );
};

export default ResetPasswordPage;