// Libraries imports
import { useRouter } from 'next/navigation';
import { Button } from 'pg-components';
import { toast } from 'react-toastify';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';

// Local imports
import { Document } from '@/lib/types/documentsAPI';

interface Props {
    document?: Document;
}

export const FileActions = ({ document }: Props) => {
    const router = useRouter();

    return (
        <div className='m-2 grid gap-2'>
            <Button
                icon={faFileInvoice}
                text='Add AP Invoice'
                onClick={() => {
                    // TODO: Add the tenant id to the URL
                    router.push(
                        `/private/accounting/b99f942c-a141-4555-9554-14a09c5f94a4/expenses/addApInvoice?docId=${document?.id}`
                    );
                }}
            />
            <Button
                icon={faFileInvoice}
                text='Add AR Invoice'
                onClick={() =>
                    toast.info(
                        'This button does not work for the moment, just a mockup'
                    )
                }
            />
        </div>
    );
};
