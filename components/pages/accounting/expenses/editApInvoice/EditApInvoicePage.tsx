'use client';

// React imports
import { useCallback, useRef, useState } from 'react';
// Libraries imports
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { Allotment } from 'allotment';
import Form, { GroupItem, Item, SimpleItem } from 'devextreme-react/form';
import SelectBox from 'devextreme-react/select-box';
import { toast } from 'react-toastify';
// Local imports
import { BusinessPartners } from '@/lib/types/businessPartners';
import { ApInvoice } from '@/lib/types/apInvoice';
import { TokenRes } from '@/lib/types/token';
import { apiPost } from '@/lib/utils/apiPost';
import { customError } from '@/lib/utils/customError';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import { dateFormat } from '@/lib/utils/datagrid/customFormats';
import { Button } from 'pg-components';
import PreviewWrapper from '../addApInvoice/PreviewWrapper';

interface Props {
    token: TokenRes;
    id: string;
    tenatsBusinessPartners: BusinessPartners[];
    allBusinessPartners: BusinessPartners[];
}

export const EditApInvoicePage = ({
    token,
    id,
    tenatsBusinessPartners,
    allBusinessPartners,
}: Props) => {
    const selectboxRef = useRef<any>();
    const [file, setFile] = useState<File>();
    const [fileDataURL, setFileDataURL] = useState(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [invoiceData, setInvoiceData] = useState<any>();
    const [lines, setLines] = useState({});
    const [popUpVisible, setPopUpVisible] = useState<boolean>(false);

    const handleSaveApInvoice = useCallback(async () => {
        const toastId = toast.loading('Saving Invoice');
        setIsLoading(true);
        const id = 'b99f942c-a141-4555-9554-14a09c5f94a4';
        const idBP = '8b5006f9-72d1-4539-b6ea-0cc261d93055';

        let invoiceLinesAPInvoice: any[] = [];

        for (const invoiceLine of invoiceData.form.invoiceLines) {
            invoiceLinesAPInvoice.push({
                ...invoiceLine,
                expenseCategoryId: 'e8dcfa3c-8c1b-424a-9fbb-3adfb0d06fb0',
                depreciationRatePerYear: 0,
                serviceDateFrom: '2023-09-19T09:14:41.861Z',
                serviceDateTo: '2023-09-19T09:14:41.861Z',
            });
        }

        const valuesToSend: ApInvoice = {
            businessPartner: {
                name: invoiceData.form.businessPartner.name,
                vatNumber: invoiceData.form.businessPartner.vatNumber,
            },
            refNumber: invoiceData.form.refNumber,
            date: invoiceData.form.date,
            currency: 'EUR',
            totalAmount: invoiceData.form.totalAmount,
            totalBaseAmount: invoiceData.form.totalBaseAmount,
            totalTax: invoiceData.form.totalTax,
            totalTaxPercentage: invoiceData.form.totalTaxPercentage,
            invoiceLines: invoiceLinesAPInvoice,
        };

        try {
            console.log('Valores a enviar: ', valuesToSend);
            console.log(
                'Valores a enviar en JSON: ',
                JSON.stringify(valuesToSend)
            );
            // SAVE INVOICE
            const data = await apiPost(
                `/accounting/tenants/${id}/businesspartners/${idBP}/apinvoices`,
                valuesToSend,
                token,
                'Error saving AP Invoice'
            );
            console.log('TODO CORRECTO, valores de vuelta: ', data);
            updateSuccessToast(toastId, 'AP Invoice saved correctly!');
            // Pass the ID to reload the page
            //router.push(`/private/accounting/${id}/expenses?createdId=${data.refNumber}`)
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [invoiceData, token]);

    // Remove BP that are already related to the tenant
    let totalBP = allBusinessPartners.filter(
        (u) => tenatsBusinessPartners.findIndex((lu) => lu.id === u.id) === -1
    );
    const [value, setValue] = useState<BusinessPartners>();

    return (
        <div className='absolute inset-4 w-screen'>
            <div className='h-full'>
                <Allotment defaultSizes={[65, 35]}>
                    <Allotment.Pane>
                        <div className='mr-4 h-full overflow-y-auto overflow-x-hidden'>
                            <div className='mr-2 flex flex-row justify-end gap-4'>
                                <div className='w-10'>
                                    <Button
                                        id='saveButton'
                                        icon={faFloppyDisk}
                                        onClick={handleSaveApInvoice}
                                        disabled={!file}
                                    />
                                </div>
                            </div>
                            <Form formData={invoiceData} labelLocation='left'>
                                <GroupItem
                                    colCount={2}
                                    caption='Supplier invoice'
                                >
                                    <Item label={{ text: 'Provider' }}>
                                        <SelectBox
                                            items={tenatsBusinessPartners}
                                            displayExpr='name'
                                            ref={selectboxRef}
                                            valueExpr='vatNumber'
                                            searchEnabled={true}
                                            // value={
                                            //     selectedProvider
                                            //         ? selectedProvider.vatNumber
                                            //         : undefined
                                            // }
                                            dropDownOptions={{
                                                toolbarItems: [
                                                    {
                                                        toolbar: 'bottom',
                                                        widget: 'dxButton',
                                                        options: {
                                                            icon: 'plus',
                                                            width: 90,
                                                            elementAttr: {
                                                                style: 'min-width: 55px;!important',
                                                            },
                                                            onClick: () =>
                                                                setPopUpVisible(
                                                                    true
                                                                ),
                                                        },
                                                    },
                                                ],
                                            }}
                                        />
                                    </Item>
                                    <SimpleItem
                                        dataField='form.refNumber'
                                        label={{ text: 'Invoice Number' }}
                                    />
                                    <SimpleItem
                                        dataField='form.businessPartner.vatNumber'
                                        label={{ text: 'CIF' }}
                                    />
                                    <SimpleItem
                                        dataField='form.date'
                                        label={{ text: 'Date of invoice' }}
                                        editorType='dxDateBox'
                                        editorOptions={{
                                            displayFormat: dateFormat,
                                        }}
                                    />
                                </GroupItem>
                            </Form>
                            <Form
                                formData={invoiceData}
                                labelMode='static'
                                className='mr-2'
                            >
                                <GroupItem caption={`Items/Lines`}>
                                    {invoiceData.form.invoiceLines.map(
                                        (invoice: any, index: number) => {
                                            return (
                                                <GroupItem
                                                    key={`GroupItem${index}`}
                                                    colCount={15}
                                                >
                                                    <Item
                                                        key={`description${index}`}
                                                        dataField={`form.invoiceLines[${index}].description`}
                                                        label={{
                                                            text: 'Description',
                                                        }}
                                                        colSpan={3}
                                                        cssClass='itemStyle'
                                                    />
                                                    <Item
                                                        key={`code${index}`}
                                                        dataField={`analyzedInvoiceLines[${index}].predictedCategoryId`}
                                                        label={{ text: 'Code' }}
                                                        cssClass='itemStyle'
                                                    />
                                                    <Item
                                                        key={`category${index}`}
                                                        dataField={`analyzedInvoiceLines[${index}].predictedCategoryId`}
                                                        label={{
                                                            text: 'Category',
                                                        }}
                                                        colSpan={2}
                                                        cssClass='itemStyle'
                                                    />
                                                    <Item
                                                        key={`serviceDateFrom${index}`}
                                                        dataField={`form.invoiceLines[${index}].serviceDateFrom`}
                                                        label={{ text: 'From' }}
                                                        colSpan={2}
                                                        editorType='dxDateBox'
                                                        editorOptions={{
                                                            displayFormat:
                                                                dateFormat,
                                                        }}
                                                        cssClass='itemStyle'
                                                    />
                                                    <Item
                                                        key={`serviceDateTo${index}`}
                                                        dataField={`form.invoiceLines[${index}].serviceDateTo`}
                                                        label={{ text: 'To' }}
                                                        colSpan={2}
                                                        editorType='dxDateBox'
                                                        editorOptions={{
                                                            displayFormat:
                                                                dateFormat,
                                                        }}
                                                        cssClass='itemStyle'
                                                    />
                                                    <Item
                                                        key={`depreciationRatePerYear${index}`}
                                                        dataField={`form.invoiceLines[${index}].depreciationRatePerYear`}
                                                        label={{
                                                            text: 'Deprication',
                                                        }}
                                                        editorOptions={{
                                                            format: "#0.##'%'",
                                                        }}
                                                        cssClass='itemStyle'
                                                    />
                                                    <Item
                                                        key={`quantity${index}`}
                                                        dataField={`form.invoiceLines[${index}].quantity`}
                                                        label={{
                                                            text: 'Amout',
                                                        }}
                                                        cssClass='itemStyle'
                                                    />
                                                    <Item
                                                        key={`unitPrice${index}`}
                                                        dataField={`form.invoiceLines[${index}].unitPrice`}
                                                        label={{
                                                            text: 'Unit Price',
                                                        }}
                                                        editorOptions={{
                                                            format: {
                                                                type: 'currency',
                                                                currency: 'EUR',
                                                                precision: 2,
                                                            },
                                                        }}
                                                        cssClass='itemStyle'
                                                    />
                                                    <Item
                                                        key={`totalUnitPrice${index}`}
                                                        dataField={`form.invoiceLines[${index}].totalLinePrice`}
                                                        label={{
                                                            text: 'Total Line Price',
                                                        }}
                                                        editorOptions={{
                                                            format: {
                                                                type: 'currency',
                                                                currency: 'EUR',
                                                                precision: 2,
                                                            },
                                                        }}
                                                        cssClass='itemStyle'
                                                    />
                                                    <Item
                                                        key={`button${index}`}
                                                        itemType='button'
                                                        horizontalAlignment='left'
                                                        buttonOptions={{
                                                            icon: 'trash',
                                                            type: 'danger',
                                                            onClick: () => {
                                                                // Set a new empty line
                                                                invoiceData.form.invoiceLines.splice(
                                                                    index,
                                                                    1
                                                                );
                                                                // Update items fields
                                                                setLines([]);
                                                            },
                                                        }}
                                                        cssClass='deleteButton'
                                                    />
                                                </GroupItem>
                                            );
                                        }
                                    )}
                                </GroupItem>
                                <Item
                                    itemType='button'
                                    horizontalAlignment='left'
                                    buttonOptions={{
                                        icon: 'add',
                                        text: 'Add line',
                                        onClick: () => {
                                            // Set a new empty line
                                            invoiceData.form.invoiceLines.push({
                                                description: '',
                                                tax: null,
                                                quantity: null,
                                                unitPrice: null,
                                                expenseCategoryId: '',
                                                depreciationRatePerYear: null,
                                                serviceDateFrom: '',
                                                serviceDateTo: '',
                                            });
                                            // Update items fields
                                            setLines([]);
                                        },
                                    }}
                                />
                            </Form>
                            <Form
                                formData={invoiceData}
                                labelLocation='left'
                                style={{
                                    width: '10vw',
                                    float: 'right',
                                    marginRight: '2em',
                                }}
                            >
                                <GroupItem>
                                    <Item
                                        dataField='form.totalBaseAmount'
                                        label={{ text: 'Base Amout' }}
                                        editorOptions={{
                                            format: {
                                                type: 'currency',
                                                currency: 'EUR',
                                                precision: 2,
                                            },
                                        }}
                                    />
                                    <Item
                                        dataField='form.totalTax'
                                        label={{ text: 'IVA' }}
                                        editorOptions={{
                                            format: {
                                                type: 'currency',
                                                currency: 'EUR',
                                                precision: 2,
                                            },
                                        }}
                                    />
                                    <Item
                                        dataField='form.totalAmount'
                                        label={{ text: 'Total Amout' }}
                                        editorOptions={{
                                            format: {
                                                type: 'currency',
                                                currency: 'EUR',
                                                precision: 2,
                                            },
                                        }}
                                    />
                                </GroupItem>
                            </Form>
                        </div>
                    </Allotment.Pane>
                    <Allotment.Pane>
                        <div className='ml-2'>
                            <PreviewWrapper file={fileDataURL} />
                        </div>
                    </Allotment.Pane>
                </Allotment>
            </div>
        </div>
    );
};
