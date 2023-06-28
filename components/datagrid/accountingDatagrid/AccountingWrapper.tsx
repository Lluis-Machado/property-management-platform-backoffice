// React imports
// Library imports
import { useRouter } from 'next/navigation';

// Local imports
import Datagrid from './Datagrid';

interface Props {
    dataSource: any[];
};

const AccountingWrapper = ({ dataSource }: Props): React.ReactElement => {
    const router = useRouter();

    const handleDouleClick = ({ data }: any) => {
        router.push(`./accounting/${data.id}/incomes`)
    }
    return (
        <div className='mx-8'>
            <Datagrid dataSource={dataSource} handleDouleClick={handleDouleClick} />
        </div>
    )
}

export default AccountingWrapper