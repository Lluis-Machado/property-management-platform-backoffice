// Local imports
import { Locale } from '@/i18n-config';
import PageSelector from './PageSelector';
import { HeaderOptions } from './HeaderOptions';

export const Header = ({ lang }: { lang: Locale }): React.ReactElement => {
    return (
        <div className='flex h-header flex-row justify-between'>
            {/* Page Selector */}
            <PageSelector />
            {/* Header options */}
            <HeaderOptions lang={lang} />
        </div>
    );
};

export default Header;
