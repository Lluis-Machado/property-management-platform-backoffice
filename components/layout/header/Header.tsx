// Local imports
import { Locale } from '@/i18n-config';
import PageSelector from './PageSelector';
import { HeaderOptions } from './HeaderOptions';
import { User } from '@/lib/types/user';

interface Props {
    lang: Locale;
    user: User;
}

export const Header = ({ lang, user }: Props): React.ReactElement => {
    return (
        <div className='flex h-header flex-row justify-between'>
            {/* Page Selector */}
            <PageSelector />
            {/* Header options */}
            <HeaderOptions lang={lang} user={user} />
        </div>
    );
};

export default Header;
