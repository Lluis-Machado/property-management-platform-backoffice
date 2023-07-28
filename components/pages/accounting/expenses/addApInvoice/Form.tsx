//React imports

// Libraries imports
import Form, { GroupItem, Item, SimpleItem } from 'devextreme-react/form';

// Local imports
import './addApIncoice.css';

const initialValues = {
    businessPartner: {
        name: 'string',
        vatNumber: 'string',
    },
    refNumber: 'string',
    date: '2023-07-27',
};

const CreateInvoiceForm = () => {
    return (
        <>
            <Form formData={initialValues} labelLocation='left'>
                <GroupItem colCount={2} caption='Supplier invoice'>
                    <SimpleItem
                        dataField='businessPartner.name'
                        label={{ text: 'Provider' }}
                    />
                    <SimpleItem
                        dataField='refNumber'
                        label={{ text: 'Invoice Number' }}
                    />
                    <SimpleItem
                        dataField='businessPartner.vatNumber'
                        label={{ text: 'CIF' }}
                    />
                    <SimpleItem
                        dataField='date'
                        label={{ text: 'Date of invoice' }}
                    />
                </GroupItem>
            </Form>
        </>
    );
};

export default CreateInvoiceForm;
