// Local imports
import CompaniesPage from '@/components/pages/companies/CompaniesPage';
import { Locale } from '@/i18n-config';
import { CompanyData } from '@/lib/types/companyData';
import { getApiData } from '@/lib/utils/getApiData';
import { sortByProperty } from '@/lib/utils/sortByProperty';

interface Props {
    params: { lang: Locale };
}

const Companies = async ({ params: { lang } }: Props) => {
    const companyData = await getApiData<CompanyData[]>(
        '/companies/companies?includeDeteted=false',
        'Error while getting companies'
    );

    sortByProperty(companyData, 'name');

    return (
        <>
            <div className='mt-4 text-lg text-secondary-500'>
                Select a company
            </div>
            <CompaniesPage dataSource={companyData} />
        </>
    );
};

export default Companies;
