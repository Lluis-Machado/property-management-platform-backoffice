// local imports
import ProfilePage from '@/components/pages/ProfilePage';
import { Locale } from '@/i18n-config';

interface Props {
  params: { lang: Locale }
};

const page = (): React.ReactElement => (
  <ProfilePage />
);

export default page;