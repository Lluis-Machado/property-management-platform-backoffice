// local imports
import PropertyFormInfo from '@/components/forms/propertyFormInfo/PropertyFormInfo';
interface Props {
  params: { id: string };
};

const page = ({ params: { id } }: Props): React.ReactElement => (
  <>
    <div className='text-l text-secondary-500 mb-3'>
      {`Properties / ${id}`}
    </div>
    <PropertyFormInfo id={id} />
  </>
);

export default page;