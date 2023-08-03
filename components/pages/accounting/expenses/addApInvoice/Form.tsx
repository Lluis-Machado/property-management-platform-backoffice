//React imports

// Libraries imports
import Form, { GroupItem, Item, SimpleItem } from 'devextreme-react/form';

// Local imports

const initialValues = {
    businessPartner: {
        name: '',
        vatNumber: '',
    },
    refNumber: '',
    date: '',
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
            <Form formData={invoiceData} labelLocation='left'>
                <GroupItem colCount={1} caption={`Items/Lines`}>
                    {invoiceData.addresses.map((invoice, index) => {
                        return (
                            <GroupItem key={`GroupItem${index}`} colCount={11}>
                                <Item
                                    key={`Description${index}`}
                                    dataField={`invoice[${index}.description]`}
                                    label={{ text: 'Description' }}
                                />
                                <Item
                                    key={`code${index}`}
                                    dataField={`invoice[${index}].code`}
                                    label={{ text: 'Code' }}
                                />

                                <Item
                                    key={`category${index}`}
                                    dataField={`invoice[${index}],category`}
                                    label={{ text: 'category' }}
                                />
                                <Item
                                    key={`from${index}`}
                                    dataField={`invoice[${index}].from`}
                                    label={{ text: 'From' }}
                                />
                                <Item
                                    key={`to${index}`}
                                    dataField={`invoice[${index}].to`}
                                    label={{ text: 'To' }}
                                />
                                <Item
                                    key={`deprication${index}`}
                                    dataField={`invoice[${index}].deprication`}
                                    label={{ text: 'Deprication' }}
                                />
                                <Item
                                    key={`amout${index}`}
                                    dataField={`invoice[${index}].amout`}
                                    label={{ text: 'Amout' }}
                                />
                                <Item
                                    key={`price${index}`}
                                    dataField={`invoice[${index}].amout`}
                                    label={{ text: 'Price' }}
                                />
                                <Item
                                    key={`tax${index}`}
                                    dataField={`invoice[${index}].tax`}
                                    label={{ text: 'Taxes' }}
                                />
                                <Item
                                    key={`taxes included${index}`}
                                    dataField={`invoice[${index}].taxesincluded`}
                                    label={{ text: 'taxes included' }}
                                />

                                <Item
                                    key={`button${index}`}
                                    itemType='button'
                                    horizontalAlignment='left'
                                    buttonOptions={{
                                        icon: 'trash',
                                        text: 'Remove line',
                                        onClick: () => {
                                            // Set a new empty address
                                            invoiceData.invoice.splice(
                                                index,
                                                1
                                            );
                                            // Update address fields
                                            setAddressOptions([]);
                                        },
                                    }}
                                />
                            </GroupItem>
                        );
                    })}
                </GroupItem>
            </Form>
        </>
    );
};

export default CreateInvoiceForm;
