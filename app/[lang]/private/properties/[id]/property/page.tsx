// local imports
import PropertyFormInfo from '@/components/forms/propertyFormInfo/PropertyFormInfo';
interface Props {
  params: { id: string };
};

interface PropertyValues {
  name: string;
  type: string;
  catastralRef: string;
  mainContact: string;
  addressLine1: string
  addressLine2: string;
  city: string;
  region: string;
  state: string;
  postalCode: string;
  country: string;
}

const initialValues: PropertyValues = {
  name: 'Villa Sonnenschein',
  type: 'Apartment',
  catastralRef: '13 077 A 018 00039 0000 FP',
  mainContact: 'Sr. Schaller',
  addressLine1: 'Calle...',
  addressLine2: '',
  city: 'Palma',
  region: 'Mallorca',
  state: 'Illes Balears',
  postalCode: '07010',
  country: 'España',
};

const page = ({ params: { id } }: Props): React.ReactElement => (
  <>
    <div className='text-l text-secondary-500 mb-3'>
      {`Properties / ${id}`}
    </div>
    <PropertyFormInfo initialValues={initialValues}  />
  </>
);

export default page;