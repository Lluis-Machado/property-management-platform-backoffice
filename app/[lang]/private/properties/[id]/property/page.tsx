// local imports
import PropertyWrapper from "@/components/datagrid/propertiesOwnersDatagrid/PropertyWrapper"

interface Props {
  params: { id: string }
}

const page = ({ params: { id } }: Props): React.ReactElement => {

  return (
    <>
      <div className='text-l text-secondary-500 mb-3'>{`Properties / ${id}/ Property Info`}</div>
      <PropertyWrapper id = {id} />
    </>
  )
}

export default page