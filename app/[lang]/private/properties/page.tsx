// Local imports
import data from '@/components/pages/properties/data.json';
import PropertiesWrapper from '@/components/pages/properties/PropertiesWrapper';

const Properties = (): React.ReactElement => (
    <>
        <div className='text-l text-secondary-500 mt-4'>
            Select a property
        </div>
        <PropertiesWrapper dataSource={data} />
    </>
);

export default Properties;