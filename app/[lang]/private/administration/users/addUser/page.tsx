import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import AddUserPage from '@/components/pages/users/AddUserPage';
import { Locale } from '@/i18n-config';

interface Props {
    params: { lang: Locale };
}

const AddUser = async ({ params: { lang } }: Props) => {
    return (
        <>
            <Breadcrumb />
            <AddUserPage lang={lang} />
        </>
    );
};

export default AddUser;
