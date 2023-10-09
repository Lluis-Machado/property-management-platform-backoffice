'use client';

// React imports
import { useCallback, useEffect, useRef, useState } from 'react';
// Libraries imports
import {
    faFloppyDisk,
    faSave,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
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
import { downloadDocument } from '@/lib/utils/documents/apiDocuments';
import TooltipCostType from '@/components/tooltips/TooltipCostType';
import TooltipCostTypeColor from '@/components/tooltips/TooltipCostTypeColor';
import ToolbarTooltipsApInvoiceEdit from '@/components/tooltips/ToolbarTooltipsApInvoiceEdit';
import ConfirmationPopup from '@/components/popups/ConfirmationPopup';
import { apiDeleteAccounting } from '@/lib/utils/apiDeleteAccounting';

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
    const [fileDataURL, setFileDataURL] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [lines, setLines] = useState({});
    const [popUpVisible, setPopUpVisible] = useState<boolean>(false);
    const [deleteVisible, setDeleteVisible] = useState<boolean>(false);

    //////////// Refs ////////////
    const selectboxRef = useRef<any>();
    const formRef = useRef<Form>(null);
    const serviceDateToRefs = useRef<DateBox[] | any>([]);
    const serviceDateFromRefs = useRef<any[]>([]);
    const depreciationRatePerYearRefs = useRef<any[]>([]);

    //////////// Custom Hooks ////////////
    const router = useRouter();

    // Function to get Doc Data from Backend
    // TODO MISSING DOC ID & ARCHIVE ID
    useEffect(() => {
        const archiveId = 'c1b1bacc-7a32-41d2-9dc0-e67afc867d0f';
        const docId = '0059cd7e-cf90-4cb6-be13-17fe08cee45e';
        if (docId !== null && archiveId !== null) {
            const apInvoice = async () => {
                const url = URL.createObjectURL(
                    await downloadDocument(archiveId, docId)
                );
                setFileDataURL(url);
            };
            apInvoice();
        }
    }, []);

    //Function to save updated ap invoice
    const handleUpdateApInvoice = useCallback(async () => {
        const toastId = toast.loading('Updating Invoice');
        setIsLoading(true);

        const valuesToSend: ApInvoice = {
            ...apInvoiceData,
            businessPartnerId: apInvoiceData.businessPartnerId,
        };

        try {
            console.log('Valores a enviar: ', valuesToSend);
            console.log(
                'Valores a enviar en JSON: ',
                JSON.stringify(valuesToSend)
            );

            const data = await apiPatchAccounting(
                '/api/accounting/apInvoices',
                id!,
                invoiceId!,
                valuesToSend
            );

            console.log('TODO CORRECTO, valores de vuelta: ', data);
            updateSuccessToast(toastId, 'AP Invoice saved correctly!');
            // Pass the ID to reload the page
            router.push(
                `/private/accounting/${id}/expenses?updatedId=${data.refNumber}`
            );
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [router, id, invoiceId, apInvoiceData]);

    // Function delete Ap Invoice
    const handleDelete = useCallback(async () => {
        const toastId = toast.loading('Deleting invoice...');
        try {
            await apiDeleteAccounting(
                '/api/accounting/apInvoices',
                id!,
                invoiceId!
            );

            updateSuccessToast(toastId, 'Invoice deleted correctly!');

            // Pass the ID to reload the page
            router.push(
                `/private/accounting/${id}/expenses?deletedInvoice=${invoiceId}`
            );
        } catch (error: unknown) {
            customError(error, toastId);
        }
    }, [id, invoiceId, router]);

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

    // Render Category Code with Tooltip & Tooltip Colors
    const CostTypeCellRender = (data: any) => {
        return (
            <div className='bg- flex flex-row items-center gap-2 text-center'>
                <span id={data.label + data.index}>
                    <div
                        className={`w-20 rounded-3xl px-2 py-1 text-center text-xs text-black ${TooltipCostTypeColor(
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
                    <TooltipCostType data={data.label} />
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
                        className={`ml-2 w-20 rounded-3xl px-2 py-1 text-center text-xs text-black ${TooltipCostTypeColor(
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
                    <TooltipCostType data={input.label} />
                </Tooltip>
                <TextBox visible={false} />
            </div>
        );
    };

    // Function to set field to disabled depending on Cost Code
    const changeCostType = (e: any) => {
        // INDEX IS NULL
        const index: number = e.selectedItem.index;
        if (e.selectedItem.value === 'Asset') {
            serviceDateToRefs.current![index].instance.option('disabled', true);
            serviceDateFromRefs.current![index].instance.option(
                'disabled',
                true
            );
            depreciationRatePerYearRefs.current![index].instance.option(
                'disabled',
                false
            );
        } else if (
            e.selectedItem.value === 'UAT' ||
            e.selectedItem.value === 'BAT'
        ) {
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

    return (
        <div className='absolute inset-4 w-full pl-4 pr-8'>
            <div className='h-full'>
                {/* Popups */}
                <ConfirmationPopup
                    message='Are you sure you want to delete this AP Invoice?'
                    isVisible={deleteVisible}
                    onClose={() => setDeleteVisible(false)}
                    onConfirm={handleDelete}
                />
                <ToolbarTooltipsApInvoiceEdit />
                <Allotment defaultSizes={[100]}>
                    <Allotment.Pane>
                        <div className='h-full'>
                            <div className='mr-2 flex flex-row justify-end'>
                                <div className='flex gap-4'>
                                    <div className='w-10'>
                                        <Button
                                            id='saveButton'
                                            elevated
                                            onClick={handleUpdateApInvoice}
                                            type='button'
                                            icon={faSave}
                                        />
                                    </div>
                                    <div className='w-10'>
                                        <Button
                                            id='deleteButton'
                                            elevated
                                            onClick={() =>
                                                setDeleteVisible(true)
                                            }
                                            type='button'
                                            icon={faTrash}
                                            style='danger'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='h-[95%] overflow-y-auto overflow-x-hidden'>
                                <Form
                                    formData={apInvoiceData}
                                    labelLocation='left'
                                    className='mr-2'
                                >
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
                                                value={apInvoiceData.vatNumber}
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
                                                        colCount={16}
                                                        cssClass='pb-2 border-dotted border-b-2 border-primary-500'
                                                    >
                                                        <Item
                                                            key={`code${index}`}
                                                            dataField={`invoiceLines[${index}].expenseCategory.expenseTypeCode`}
                                                            cssClass='itemStyle'
                                                            colSpan={2}
                                                        >
                                                            <SelectBox
                                                                items={[
                                                                    {
                                                                        label: 'UAT',
                                                                        value: 'UAT',
                                                                        index: `${index}`,
                                                                    },
                                                                    {
                                                                        label: 'UAV',
                                                                        value: 'UAV',
                                                                        index: `${index}`,
                                                                    },
                                                                    {
                                                                        label: 'BAT',
                                                                        value: 'BAT',
                                                                        index: `${index}`,
                                                                    },
                                                                    {
                                                                        label: 'BAV',
                                                                        value: 'BAV',
                                                                        index: `${index}`,
                                                                    },
                                                                    {
                                                                        label: 'Asset',
                                                                        value: 'Asset',
                                                                        index: `${index}`,
                                                                    },
                                                                    {
                                                                        label: 'NA',
                                                                        value: 'NA',
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
                                                                defaultValue={
                                                                    apInvoiceData
                                                                        .invoiceLines[
                                                                        index
                                                                    ]
                                                                        .expenseCategory
                                                                        .expenseTypeCode
                                                                }
                                                                onValueChanged={
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
                                                            colSpan={4}
                                                            cssClass='itemStyle'
                                                        />
                                                        <Item
                                                            key={`description${index}`}
                                                            dataField={`invoiceLines[${index}].description`}
                                                            label={{
                                                                text: 'Description',
                                                            }}
                                                            colSpan={10}
                                                            cssClass='itemStyle'
                                                        >
                                                            <NumericRule />
                                                        </Item>
                                                        <Item
                                                            key={`serviceDateFrom${index}`}
                                                            dataField={`invoiceLines[${index}].serviceDateFrom`}
                                                            label={{
                                                                text: 'From',
                                                            }}
                                                            cssClass='itemStyle'
                                                            colSpan={2}
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
                                                                ref={(
                                                                    invoice
                                                                ) =>
                                                                    (serviceDateFromRefs.current[
                                                                        index
                                                                    ] = invoice)
                                                                }
                                                            />
                                                        </Item>
                                                        <Item
                                                            key={`serviceDateTo${index}`}
                                                            dataField={`invoiceLines[${index}].serviceDateTo`}
                                                            label={{
                                                                text: 'To',
                                                            }}
                                                            cssClass='itemStyle'
                                                            colSpan={2}
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
                                                                ref={(
                                                                    invoice
                                                                ) =>
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
                                                                text: 'Depreciation',
                                                            }}
                                                            editorType='dxNumberBox'
                                                            editorOptions={{
                                                                format: "#0.##'%'",
                                                            }}
                                                            cssClass='itemStyle'
                                                            colSpan={2}
                                                        >
                                                            <NumberBox
                                                                ref={(
                                                                    invoice
                                                                ) =>
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
                                                                text: 'Amount',
                                                            }}
                                                            cssClass='itemStyle'
                                                            colSpan={2}
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
                                                            key={`discount${index}`}
                                                            dataField={`invoiceLines[${index}].discount`}
                                                            label={{
                                                                text: 'DTO',
                                                            }}
                                                            editorOptions={{
                                                                format: "#0.##'%'",
                                                            }}
                                                            cssClass='itemStyle'
                                                        ></Item>
                                                        <Item
                                                            key={`unitPrice${index}`}
                                                            dataField={`invoiceLines[${index}].unitPrice`}
                                                            label={{
                                                                text: 'Unit Price',
                                                            }}
                                                            editorOptions={{
                                                                format: {
                                                                    type: 'currency',
                                                                    currency:
                                                                        'EUR',
                                                                    precision: 2,
                                                                },
                                                            }}
                                                            cssClass='itemStyle'
                                                            colSpan={2}
                                                        >
                                                            <RequiredRule />
                                                        </Item>
                                                        <Item
                                                            key={`totalUnitPrice${index}`}
                                                            dataField={`invoiceLines[${index}].totalPrice`}
                                                            label={{
                                                                text: 'Total Line Price',
                                                            }}
                                                            editorOptions={{
                                                                format: {
                                                                    type: 'currency',
                                                                    currency:
                                                                        'EUR',
                                                                    precision: 2,
                                                                },
                                                            }}
                                                            cssClass='itemStyle'
                                                            colSpan={2}
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
                                                                    setLines(
                                                                        []
                                                                    );
                                                                },
                                                            }}
                                                            cssClass='deleteButton'
                                                            colSpan={2}
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
                                                apInvoiceData.invoiceLines.push(
                                                    {
                                                        description: '',
                                                        tax: null,
                                                        discount: null,
                                                        quantity: 0,
                                                        unitPrice: 0,
                                                        totalPrice: 0,
                                                        expenseCategory: {
                                                            id: null,
                                                            name: null,
                                                            expenseTypeCode:
                                                                null,
                                                        },
                                                        depreciationRatePerYear:
                                                            null,
                                                        serviceDateFrom: '',
                                                        serviceDateTo: '',
                                                        fixedAsset: null,
                                                    }
                                                );
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
                                        className='mr-2'
                                    >
                                        <GroupItem>
                                            <Item
                                                dataField='grossAmount'
                                                label={{ text: 'Base Amount' }}
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
                                                dataField='netAmount'
                                                label={{ text: 'Total Amount' }}
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
                        </div>
                    </Allotment.Pane>
                    {/* <Allotment.Pane>
                        <div className='ml-2'>
                            <PreviewWrapper file={fileDataURL} />
                        </div>
                    </Allotment.Pane> */}
                </Allotment>
            </div>
        </div>
    );
};
