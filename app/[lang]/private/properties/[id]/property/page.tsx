interface Props {
  params: { id: string }
}

const page = ({ params: { id } }: Props): React.ReactElement => {

  return (
    <>
      <div className='text-xl text-secondary-500 mb-3'>{`Properties / ${id}`}</div>
    </>
  )
}

export default page