// local imports
import PropertyWrapper from "@/components/pages/properties/property/PropertyWrapper"

interface Props {
  params: { id: string }
}

async function getData(id: string) {
  const res = await fetch(`https://stage.plattesapis.net/properties/properties/${id}`, { cache: 'no-cache' })
  if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    return res.json()
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
