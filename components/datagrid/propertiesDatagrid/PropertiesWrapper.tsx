'use client'

// React imports
import { useCallback } from 'react';

// Library imports
import { useRouter } from 'next/navigation';

// Local imports
import Datagrid from '../datagrid/Datagrid';

interface Props {
    dataSource: any[];
};

const PropertiesWrapper = ({ dataSource }: Props): React.ReactElement => {
    const router = useRouter();

    const handleDouleClick = useCallback(({ data }: any) => {
        router.push(`./properties/${data.id}/property`)
    }, [router])

    return (
        <div className='mx-8'>
            <Datagrid dataSource={dataSource} handleDouleClick={handleDouleClick} />
        </div>
    )
}

export default PropertiesWrapper