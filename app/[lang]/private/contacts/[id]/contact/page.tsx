interface Props {
    params: { id: string }
}

const page = ({ params: { id } }: Props): React.ReactElement => {
    return (
        <>
            <div className='text-lg text-secondary-500'>{`Contacts / ${id} / Contact`}</div>
        </>
    )
}

export default page