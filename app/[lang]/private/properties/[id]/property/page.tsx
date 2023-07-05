// local imports
import PropertyWrapper from "@/components/pages/properties/property/PropertyWrapper"
import { ApiCallError } from "@/lib/utils/errors";

interface Props {
  params: { id: string }
}

async function getData(id: string) {
  const resp = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/properties/properties/${id}`, { cache: 'no-cache' })
    if (!resp.ok) throw new ApiCallError('Error while getting property info');
    return resp.json()
}

export default async function Property({ params: {id} }: Props) {
  const data = await getData(id)
  return (
    <>
      <div className='text-l text-secondary-500 mb-3'>{`Properties / ${id}/ Property Info`}</div>
      <PropertyWrapper id={id} data={data}></PropertyWrapper>
    </>
  )
}
