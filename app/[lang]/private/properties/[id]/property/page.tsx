import InfoCardProperty from "@/components/infoCardProperty/InfoCardProperty"
interface Props {
  params: { id: string }
}

const page = ({ params: { id } }: Props): React.ReactElement => {

  return (
    <>
      <div className='text-l text-secondary-500 mb-3'>{`Properties / ${id}`}</div>
      <InfoCardProperty/>
    </>
  )
}

export default page