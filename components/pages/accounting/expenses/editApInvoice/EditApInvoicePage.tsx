'use client';

// React imports
import { useCallback, useRef, useState } from 'react';
// Libraries imports
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { Allotment } from 'allotment';
import Form, {
    GroupItem,
    Item,
    NumericRule,
    RequiredRule,
    SimpleItem,
} from 'devextreme-react/form';
import SelectBox from 'devextreme-react/select-box';
import { toast } from 'react-toastify';
import DateBox from 'devextreme-react/date-box';
import { ValueChangedEvent } from 'devextreme/ui/date_box';
import { useRouter } from 'next/navigation';
import { NumberBox } from 'devextreme-react/number-box';
import Tooltip from 'devextreme-react/tooltip';
import TextBox from 'devextreme-react/text-box';

// Local imports
import '../../../../../lib/styles/formItems.css';
import '../../../../../node_modules/allotment/dist/style.css';
import '../../../../splitPane/style/splitPane.module.css';
import { BusinessPartners } from '@/lib/types/businessPartners';
import { ApInvoice } from '@/lib/types/apInvoice';
import { customError } from '@/lib/utils/customError';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import { dateFormat } from '@/lib/utils/datagrid/customFormats';
import { Button } from 'pg-components';
import PreviewWrapper from '../addApInvoice/PreviewWrapper';
import { apiPatchAccounting } from '@/lib/utils/apiPatchAccounting';

interface Props {
    id: string;
    invoiceId: string;
    apInvoiceData: ApInvoice;
    tenatsBusinessPartners: BusinessPartners[];
}

export const EditApInvoicePage = ({
    id,
    invoiceId,
    apInvoiceData,
    tenatsBusinessPartners,
}: Props) => {
    //////////// States ////////////
    const [fileDataURL, setFileDataURL] = useState(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [invoiceData, setInvoiceData] = useState<any>();
    const [lines, setLines] = useState({});
    const [popUpVisible, setPopUpVisible] = useState<boolean>(false);

    //////////// Refs ////////////
    const selectboxRef = useRef<any>();
    const formRef = useRef<Form>(null);
    const serviceDateToRefs = useRef<DateBox[] | any>([]);
    const serviceDateFromRefs = useRef<any[]>([]);
    const depreciationRatePerYearRefs = useRef<any[]>([]);

    //////////// Custom Hooks ////////////
    const router = useRouter();

    //Function to save updated ap invoice
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
            // businessPartner: {
            //     name: apInvoiceData.businessPartnerName,
            //     vatNumber: apInvoiceData.vatNumber,
            // },
            businessPartnerId: apInvoiceData.businessPartnerId,
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

            const data = await apiPatchAccounting(
                `/accounting/tenants/${id}/businesspartners/${invoiceId}`,
                id!,
                invoiceId!,
                valuesToSend
            );

            console.log('TODO CORRECTO, valores de vuelta: ', data);
            updateSuccessToast(toastId, 'AP Invoice saved correctly!');
            // Pass the ID to reload the page
            router.push(
                `/private/accounting/${id}/expenses?createdId=${data.refNumber}`
            );
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [invoiceData]);

    // Format date and set max/min dates
    const validateDateTo = (e: ValueChangedEvent, index: number) => {
        serviceDateFromRefs.current![index].instance.option('max', e);
        serviceDateToRefs.current![index].instance.option(
            'displayFormat',
            dateFormat
        );
    };

    const validateDateFrom = (e: ValueChangedEvent, index: number) => {
        serviceDateToRefs.current![index].instance.option('min', e);
        serviceDateFromRefs.current![index].instance.option(
            'displayFormat',
            dateFormat
        );
    };

    // SELECTBOX CODE
    // Tooltip
    const ContentTooltip = ({ data }: { data: string }): React.ReactElement => {
        switch (data) {
            case 'BAT':
                return (
                    <>
                        <strong>BAT</strong> - Beschränkt abzugsfähige Kosten
                        pro vermieteten Tag
                    </>
                );
            case 'BAV':
                return (
                    <>
                        <strong>BAV</strong> - Beschränkt abzugsfähige Kosten
                        für das gesamte Jahr
                    </>
                );
            case 'UAT':
                return (
                    <>
                        <strong>UAT</strong> - Unbeschränkt abzugsfähige Kosten
                        pro vermieteten Tag
                    </>
                );
            case 'UAV':
                return (
                    <>
                        <strong>UAV</strong> - Unbeschränkt abzugsfähige Kosten
                        für das gesamte Jahr
                    </>
                );
            case 'NA':
                return (
                    <>
                        <strong>NA</strong> - Nicht abzugsfähige Kosten
                    </>
                );
            case 'Aktiv':
                return (
                    <>
                        <strong>Aktiv</strong> - Aktivierungspflichtige Kosten
                    </>
                );
            case 'Asset':
                return (
                    <>
                        <strong>Asset</strong> - Fixed Asset
                    </>
                );
            default:
                return <></>;
        }
    };

    // Colors Tooltip
    const getBadgeColor = (data: string): string => {
        const colors: any = {
            BAT: 'bg-red-300',
            BAV: 'bg-orange-300',
            UAT: 'bg-green-300',
            UAV: 'bg-lime-300',
            NA: 'bg-cyan-300',
            Aktiv: 'bg-purple-300',
            Asset: 'bg-blue-300',
        };
        return colors[data];
    };

    // Render Category Code with Tooltip & Tooltip Colors
    const CostTypeCellRender = (data: any) => {
        return (
            <div className='bg- flex flex-row items-center gap-2 text-center'>
                <span id={data.label + data.index}>
                    <div
                        className={`w-20 rounded-3xl px-2 py-1 text-center text-xs text-black ${getBadgeColor(
                            data.label
                        )}`}
                    >
                        {data.label}
                    </div>
                </span>
                <Tooltip
                    target={'#' + data.label + data.index}
                    showEvent='mouseenter'
                    hideEvent='mouseleave'
                    position='right'
                >
                    <ContentTooltip data={data.label} />
                </Tooltip>
            </div>
        );
    };

    // Render Form Item  with Tooltip & Tooltip Colors
    const CostTypeFieldRender = (data: any) => {
        const input = data || {};
        if (data === null) {
            if (input) {
                (input.label = undefined), (input.index = 0);
            }
        }
        return (
            <div className='bg-flex flex h-[34px] flex-row items-center gap-2 text-center'>
                <span id={input.label + input.index}>
                    <div
                        className={`ml-2 w-20 rounded-3xl px-2 py-1 text-center text-xs text-black ${getBadgeColor(
                            input.label
                        )}`}
                    >
                        {input.label}
                    </div>
                </span>
                <Tooltip
                    target={'#' + input.label + input.index}
                    showEvent='mouseenter'
                    hideEvent='mouseleave'
                    position='right'
                >
                    <ContentTooltip data={input.label} />
                </Tooltip>
                <TextBox visible={false} />
            </div>
        );
    };

    // Function to set field to disabled depending on Cost Code
    const changeCostType = (e: any) => {
        const index: number = e.selectedItem.index;
        if (e.selectedItem.value === 4) {
            serviceDateToRefs.current![index].instance.option('disabled', true);
            serviceDateFromRefs.current![index].instance.option(
                'disabled',
                true
            );
            depreciationRatePerYearRefs.current![index].instance.option(
                'disabled',
                false
            );
        } else if (e.selectedItem.value === 0 || e.selectedItem.value === 2) {
            serviceDateToRefs.current![index].instance.option(
                'disabled',
                false
            );
            serviceDateFromRefs.current![index].instance.option(
                'disabled',
                false
            );
            depreciationRatePerYearRefs.current![index].instance.option(
                'disabled',
                true
            );
        } else {
            serviceDateToRefs.current![index].instance.option('disabled', true);
            serviceDateFromRefs.current![index].instance.option(
                'disabled',
                true
            );
            depreciationRatePerYearRefs.current![index].instance.option(
                'disabled',
                true
            );
        }
    };
    console.log(apInvoiceData);
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
                                ref={formRef}
                            >
                                <GroupItem caption={`Items/Lines`}>
                                    {apInvoiceData.invoiceLines.map(
                                        (invoice: any, index: number) => {
                                            return (
                                                <GroupItem
                                                    key={`GroupItem${index}`}
                                                    colCount={8}
                                                    cssClass='pb-2 border-dotted border-b-2 border-primary-500'
                                                >
                                                    <Item
                                                        key={`code${index}`}
                                                        dataField={`invoiceLines[${index}].expenseCategory.expenseTypeCode`}
                                                        label={{
                                                            text: 'Code',
                                                        }}
                                                        cssClass='itemStyle'
                                                    >
                                                        <SelectBox
                                                            items={[
                                                                {
                                                                    label: 'UAT',
                                                                    value: 0,
                                                                    index: `${index}`,
                                                                },
                                                                {
                                                                    label: 'UAV',
                                                                    value: 1,
                                                                    index: `${index}`,
                                                                },
                                                                {
                                                                    label: 'BAT',
                                                                    value: 2,
                                                                    index: `${index}`,
                                                                },
                                                                {
                                                                    label: 'BAV',
                                                                    value: 3,
                                                                    index: `${index}`,
                                                                },
                                                                {
                                                                    label: 'Asset',
                                                                    value: 4,
                                                                    index: `${index}`,
                                                                },
                                                                {
                                                                    label: 'NA',
                                                                    value: 5,
                                                                    index: `${index}`,
                                                                },
                                                            ]}
                                                            label='Cost'
                                                            labelMode='static'
                                                            itemRender={
                                                                CostTypeCellRender
                                                            }
                                                            fieldRender={
                                                                CostTypeFieldRender
                                                            }
                                                            displayExpr='label'
                                                            valueExpr='value'
                                                            onSelectionChanged={
                                                                changeCostType
                                                            }
                                                        />
                                                    </Item>
                                                    <Item
                                                        key={`categorie${index}`}
                                                        dataField={`invoiceLines[${index}].expenseCategory.name`}
                                                        label={{
                                                            text: 'Code',
                                                        }}
                                                        colSpan={2}
                                                        cssClass='itemStyle'
                                                    />
                                                    <Item
                                                        key={`description${index}`}
                                                        dataField={`invoiceLines[${index}].description`}
                                                        label={{
                                                            text: 'Description',
                                                        }}
                                                        colSpan={5}
                                                        cssClass='itemStyle'
                                                    >
                                                        <NumericRule />
                                                    </Item>
                                                    <Item
                                                        key={`serviceDateFrom${index}`}
                                                        dataField={`invoiceLines[${index}].serviceDateFrom`}
                                                        label={{ text: 'From' }}
                                                        cssClass='itemStyle'
                                                    >
                                                        <DateBox
                                                            label={'From'}
                                                            onValueChange={(
                                                                e: ValueChangedEvent
                                                            ) => {
                                                                validateDateFrom(
                                                                    e,
                                                                    index
                                                                );
                                                            }}
                                                            ref={(invoice) =>
                                                                (serviceDateFromRefs.current[
                                                                    index
                                                                ] = invoice)
                                                            }
                                                        />
                                                    </Item>
                                                    <Item
                                                        key={`serviceDateTo${index}`}
                                                        dataField={`invoiceLines[${index}].serviceDateTo`}
                                                        label={{ text: 'To' }}
                                                        cssClass='itemStyle'
                                                    >
                                                        <DateBox
                                                            label={'To'}
                                                            onValueChange={(
                                                                e: ValueChangedEvent
                                                            ) => {
                                                                validateDateTo(
                                                                    e,
                                                                    index
                                                                );
                                                            }}
                                                            ref={(invoice) =>
                                                                (serviceDateToRefs.current[
                                                                    index
                                                                ] = invoice)
                                                            }
                                                        />
                                                    </Item>
                                                    <Item
                                                        key={`depreciationRatePerYear${index}`}
                                                        dataField={`invoiceLines[${index}].depreciationRatePerYear`}
                                                        label={{
                                                            text: 'Deprication',
                                                        }}
                                                        editorType='dxNumberBox'
                                                        editorOptions={{
                                                            format: "#0.##'%'",
                                                        }}
                                                        cssClass='itemStyle'
                                                    >
                                                        <NumberBox
                                                            ref={(invoice) =>
                                                                (depreciationRatePerYearRefs.current[
                                                                    index
                                                                ] = invoice)
                                                            }
                                                            label='Deprication'
                                                        />
                                                    </Item>
                                                    <Item
                                                        key={`quantity${index}`}
                                                        dataField={`invoiceLines[${index}].quantity`}
                                                        label={{
                                                            text: 'Amout',
                                                        }}
                                                        cssClass='itemStyle'
                                                    >
                                                        <RequiredRule />
                                                    </Item>
                                                    <Item
                                                        key={`tax${index}`}
                                                        dataField={`invoiceLines[${index}].tax`}
                                                        label={{
                                                            text: 'IVA',
                                                        }}
                                                        editorOptions={{
                                                            format: "#0.##'%'",
                                                        }}
                                                        cssClass='itemStyle'
                                                    >
                                                        <RequiredRule />
                                                    </Item>
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
                                                    >
                                                        <RequiredRule />
                                                    </Item>
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
