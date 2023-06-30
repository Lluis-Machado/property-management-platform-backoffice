'use client'

// Library imports
import { useRouter } from 'next/navigation';

// Local imports
import Datagrid from '../datagrid/Datagrid';

interface Props {
    dataSource: any[];
};

const AccountingWrapper = ({ dataSource }: Props): React.ReactElement => {
    const router = useRouter();

    const handleDouleClick = ({ data }: any) => {
        router.push(`./accounting/${data.id}/incomes`)
    }
    return (
        <Datagrid dataSource={dataSource} handleDouleClick={handleDouleClick} />
    );
};

export default AccountingWrapper;