// Local imports
import { DocumentsFilesWrapper } from "@/components/pages/documents/files/DocumentsFilesWrapper"
import { ApiCallError } from "@/lib/utils/errors";

const page = async (): Promise<React.ReactElement> => {

  const resp = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/documents/archives`, { cache: 'no-cache' })
  if (!resp.ok) throw new ApiCallError('Error while getting archives');
  const data = await resp.json();

  return (
    <DocumentsFilesWrapper dataSource={data} />
  );
};

export default page;