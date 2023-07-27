//React imports

// Libraries imports
import Form, { GroupItem, Item } from 'devextreme-react/form';

// Local imports
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
            <Form formData={initialValues} labelMode={'floating'}>
                <GroupItem colCount={2} caption='Supplier invoice'>
                    <Item
                        dataField='businessPartner.name'
                        label={{ text: 'Provider' }}
                    />
                    <Item
                        dataField='refNumber'
                        label={{ text: 'Invoice Number' }}
                    />
                    <Item
                        dataField='businessPartner.vatNumber'
                        label={{ text: 'CIF' }}
                    />
                    <Item
                        dataField='date'
                        label={{ text: 'Date of invoice' }}
                    />
                </GroupItem>
            </Form>
        </>
    );
};

export default CreateInvoiceForm;
