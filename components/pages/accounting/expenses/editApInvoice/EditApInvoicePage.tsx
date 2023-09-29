'use client';

// React imports
import { useCallback, useRef, useState } from 'react';
// Libraries imports
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { Allotment } from 'allotment';
import Form, { GroupItem, Item, SimpleItem } from 'devextreme-react/form';
import SelectBox from 'devextreme-react/select-box';
import { toast } from 'react-toastify';
import DateBox from 'devextreme-react/date-box';
import { ValueChangedEvent } from 'devextreme/ui/date_box';

// Local imports
import '../../../../../lib/styles/formItems.css';
import '../../../../../node_modules/allotment/dist/style.css';
import '../../../../splitPane/style/splitPane.module.css';
import { BusinessPartners } from '@/lib/types/businessPartners';
import { ApInvoice } from '@/lib/types/apInvoice';
import { TokenRes } from '@/lib/types/token';
import { customError } from '@/lib/utils/customError';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import { dateFormat } from '@/lib/utils/datagrid/customFormats';
import { Button } from 'pg-components';
import PreviewWrapper from '../addApInvoice/PreviewWrapper';
import { apiPatch } from '@/lib/utils/apiPatch';

interface Props {
    token: TokenRes;
    id: string;
    invoiceId: string;
    apInvoiceData: ApInvoice;
    tenatsBusinessPartners: BusinessPartners[];
}

export const EditApInvoicePage = ({
    token,
    id,
    invoiceId,
    apInvoiceData,
    tenatsBusinessPartners,
}: Props) => {
    const selectboxRef = useRef<any>();
    const dateboxRefFrom = useRef<any>();
    const dateboxRefTo = useRef<any>();
    const [fileDataURL, setFileDataURL] = useState(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [invoiceData, setInvoiceData] = useState<any>();
    const [lines, setLines] = useState({});
    const [popUpVisible, setPopUpVisible] = useState<boolean>(false);

    const handleUpdateApInvoice = useCallback(async () => {
        const toastId = toast.loading('Updating Invoice');
        setIsLoading(true);

        let invoiceLinesAPInvoice: any[] = [];

        for (const invoiceLine of invoiceData.form.invoiceLines) {
            invoiceLinesAPInvoice.push({
                ...invoiceLine,
            });
        }

        const valuesToSend: ApInvoice = {
            businessPartner: {
                name: apInvoiceData.businessPartnerName,
                vatNumber: apInvoiceData.vatNumber,
            },
            businessPartnerId: apInvoiceData.businessPartnerId,
            businessPartnerName: apInvoiceData.businessPartnerName,
            //vatNumber: apInvoice.vatNumber,
            refNumber: apInvoiceData.refNumber,
            date: apInvoiceData.date,
            currency: 'EUR',
            totalAmount: apInvoiceData.totalAmount,
            totalBaseAmount: apInvoiceData.totalBaseAmount,
            totalTax: apInvoiceData.totalTax,
            totalTaxPercentage: apInvoiceData.totalTaxPercentage,
            invoiceLines: invoiceLinesAPInvoice,
        };

        try {
            console.log('Valores a enviar: ', valuesToSend);
            console.log(
                'Valores a enviar en JSON: ',
                JSON.stringify(valuesToSend)
            );
            throw new Error('API call not implemented');
            // SAVE INVOICE
            // const data = await apiPost(
            //     `/accounting/tenants/${id}/businesspartners/${idBP}/apinvoices`,
            //     valuesToSend,
            //     token,
            //     'Error saving AP Invoice'
            // );
            // console.log('TODO CORRECTO, valores de vuelta: ', data);
            updateSuccessToast(toastId, 'AP Invoice saved correctly!');
            // Pass the ID to reload the page
            //router.push(`/private/accounting/${id}/expenses?createdId=${data.refNumber}`)
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [invoiceData, token]);

    // Format date and set max/min dates
    const validateDateTo = (e: ValueChangedEvent) => {
        dateboxRefFrom.current!.instance.option('max', new Date(e.value));
        dateboxRefTo.current!.instance.option('displayFormat', dateFormat);
    };

    const validateDateFrom = (e: ValueChangedEvent) => {
        dateboxRefTo.current!.instance.option('min', new Date(e.value));
        dateboxRefFrom.current!.instance.option('displayFormat', dateFormat);
    };

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
                                        onClick={handleUpdateApInvoice}
                                    />
                                </div>
                            </div>
                            <Form formData={apInvoiceData} labelLocation='left'>
                                <GroupItem
                                    colCount={2}
                                    caption='Supplier invoice'
                                >
                                    <Item
                                        label={{ text: 'Provider' }}
                                        dataField='vatNumber'
                                    >
                                        <SelectBox
                                            items={tenatsBusinessPartners}
                                            displayExpr='name'
                                            ref={selectboxRef}
                                            valueExpr='vatNumber'
                                            searchEnabled={true}
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
                                        dataField='refNumber'
                                        label={{ text: 'Invoice Number' }}
                                    />
                                    <SimpleItem
                                        dataField='vatNumber'
                                        label={{ text: 'CIF' }}
                                    />
                                    <SimpleItem
                                        dataField='date'
                                        label={{ text: 'Date of invoice' }}
                                        editorType='dxDateBox'
                                        editorOptions={{
                                            displayFormat: dateFormat,
                                        }}
                                    />
                                </GroupItem>
                            </Form>
                            <Form
                                formData={apInvoiceData}
                                labelMode='static'
                                className='mr-2'
                            >
                                <GroupItem caption={`Items/Lines`}>
                                    {apInvoiceData.invoiceLines.map(
                                        (invoice: any, index: number) => {
                                            return (
                                                <GroupItem
                                                    key={`GroupItem${index}`}
                                                    colCount={15}
                                                >
                                                    <Item
                                                        key={`description${index}`}
                                                        dataField={`invoiceLines[${index}].description`}
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
                                                        key={`serviceDateFrom${index}from`}
                                                        dataField={`invoiceLines[${index}].serviceDateFrom`}
                                                        label={{ text: 'From' }}
                                                        colSpan={2}
                                                        cssClass='itemStyle'
                                                    >
                                                        <DateBox
                                                            label={'From'}
                                                            onValueChanged={
                                                                validateDateFrom
                                                            }
                                                            ref={dateboxRefFrom}
                                                        />
                                                    </Item>
                                                    <Item
                                                        key={`serviceDateTo${index}edit`}
                                                        dataField={`invoiceLines[${index}].serviceDateTo`}
                                                        label={{ text: 'To' }}
                                                        colSpan={2}
                                                        cssClass='itemStyle'
                                                    >
                                                        <DateBox
                                                            label={'To'}
                                                            ref={dateboxRefTo}
                                                            onValueChanged={
                                                                validateDateTo
                                                            }
                                                            elementAttr={{
                                                                displayFormat: {
                                                                    dateFormat,
                                                                },
                                                            }}
                                                        />
                                                    </Item>
                                                    <Item
                                                        key={`depreciationRatePerYear${index}`}
                                                        dataField={`invoiceLines[${index}].depreciationRatePerYear`}
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
                                                        dataField={`invoiceLines[${index}].quantity`}
                                                        label={{
                                                            text: 'Amout',
                                                        }}
                                                        cssClass='itemStyle'
                                                    />
                                                    <Item
                                                        key={`unitPrice${index}`}
                                                        dataField={`invoiceLines[${index}].unitPrice`}
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
                                                        dataField={`invoiceLines[${index}].totalLinePrice`}
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
                                                                apInvoiceData.invoiceLines.splice(
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
                                            apInvoiceData.invoiceLines.push({
                                                description: '',
                                                tax: null,
                                                quantity: 0,
                                                unitPrice: 0,
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
                            <div className='float-right w-1/6'>
                                <Form
                                    formData={apInvoiceData}
                                    labelLocation='left'
                                    style={{
                                        width: '10vw',
                                        float: 'right',
                                        marginRight: '2em',
                                    }}
                                >
                                    <GroupItem>
                                        <Item
                                            dataField='totalBaseAmount'
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
                                            dataField='totalTax'
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
                                            dataField='totalAmount'
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
