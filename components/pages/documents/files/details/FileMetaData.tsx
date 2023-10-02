// Libraries imports
import Form, { Item } from 'devextreme-react/form';

// Local imports
import { Document } from '@/lib/types/documentsAPI';

interface Props {
    document?: Document;
}

export const FileMetaData = ({ document }: Props) => {
    return (
        <Form formData={document} colCount={2} className='m-2'>
            {document ? (
                Object.keys(document).map((key) => (
                    <Item
                        key={key}
                        caption={key}
                        dataField={key}
                        editorOptions={{ readOnly: true }}
                    />
                ))
            ) : (
                <></>
            )}
        </Form>
    );
};
