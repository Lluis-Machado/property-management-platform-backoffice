import 'allotment/dist/style.css';
import { Locale } from '@/i18n-config';
import { getUser } from '@/lib/utils/getUser';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import SplitPage from '@/components/pages/documents/splitDocument/SplitPage';

interface Props {
    params: { lang: Locale; id: string };
}

const dataSource = {
    splitDocumentRanges: [
        {
            from: 0,
            to: 0,
        },
    ],
};

const SplitDocs = async ({ params: { lang, id } }: Props) => {
    const user = await getUser();

    return (
        <>
            <Breadcrumb />
            <SplitPage lang={lang} token={user.token} dataSource={dataSource} />
        </>
    );
};

export default SplitDocs;
