// Libraries imports
import { Document } from '@/lib/types/documentsAPI';

// Local imports
import Form, { Item } from 'devextreme-react/form';

interface Props {
    document: Document | undefined;
}

export const FileMetaData = ({ document }: Props) => {
    return (
        <div>
            <Form formData={document} colCount={2}>
                {document ? (
                    Object.keys(document).map((key) => (
                        <Item
                            key={key}
                            caption={key}
                            dataField={key}
                            disabled
                        />
                    ))
                ) : (
                    <></>
                )}
            </Form>
        </div>
    );
};
