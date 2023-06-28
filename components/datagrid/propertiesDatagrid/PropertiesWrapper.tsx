// React imports
import { useCallback } from 'react';
// Library imports
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
// Local imports
import Datagrid from './DatagridProperties';
interface Props {
    dataSource: any[];
};

const PropertiesWrapper = ({ dataSource }: Props): React.ReactElement => {
    const router = useRouter();

    const handleDoubleClick = ({ data }: any) => {
        router.push(`./properties/${data.id}/property`)
    }
    const pathName = usePathname();
    const getBasePath = useCallback((): string => pathName?.substring(0, pathName.lastIndexOf('/')) ?? '', [pathName]);
    return (
        <div className='mx-8'>
            <Datagrid 
                dataSource={dataSource} 
                handleDoubleClick={handleDoubleClick} 
                basePath={getBasePath()}    
            />
        </div>
    )
}

export default PropertiesWrapper