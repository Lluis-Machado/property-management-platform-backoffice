'use client';

//React imports
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

// Libraries imports
import { Allotment } from 'allotment';
import { toast } from 'react-toastify';
import {
    faFloppyDisk,
    faGears,
    faUpload,
} from '@fortawesome/free-solid-svg-icons';
import Form, {
    GroupItem,
    Item,
    NumericRule,
    RequiredRule,
    SimpleItem,
} from 'devextreme-react/form';
import { useRouter, useSearchParams } from 'next/navigation';
import DateBox from 'devextreme-react/date-box';
import { ValueChangedEvent } from 'devextreme/ui/date_box';
import SelectBox from 'devextreme-react/select-box';
import { Tooltip } from 'devextreme-react/tooltip';
import TextBox from 'devextreme-react/text-box';
import { NumberBox } from 'devextreme-react/number-box';

// Local imports
import '@/lib/styles/formItems.css';
import { Button } from 'pg-components';
import PreviewWrapper from './PreviewWrapper';
import '@/node_modules/allotment/dist/style.css';
import '../../../../splitPane/style/splitPane.module.css';
import { customError } from '@/lib/utils/customError';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import { dateFormat } from '@/lib/utils/datagrid/customFormats';
import {
    downloadDocument,
    uploadDocumentsToArchive,
} from '@/lib/utils/documents/apiDocuments';
import { BusinessPartners } from '@/lib/types/businessPartners';
import {
    ApInvoice,
    ApInvoiceAnalyzedData,
    InvoiceLines,
} from '@/lib/types/apInvoice';
import BpPopup from '@/components/popups/BpPopup';
import ToolbarTooltipsApInvoice from '@/components/tooltips/ToolbarTooltipsApInvoice';
import { apiPostAccounting } from '@/lib/utils/apiPostAccounting';
import TooltipCostType from '@/components/tooltips/TooltipCostType';
import TooltipCostTypeColor from '@/components/tooltips/TooltipCostTypeColor';
import { apiPost } from '@/lib/utils/apiPost';
import { InvoiceItemAnalyzer } from '@/lib/types/invoiceItemAnalyzer';
import { ExpenseCategory } from '@/lib/types/expenseCategory';

let apInvoiceData: ApInvoiceAnalyzedData = {
    form: {
        businessPartnerId: '',
        businessPartnerName: null,
        vatNumber: null,
        businessPartner: {
            id: '',
            name: '',
            vatNumber: '',
        },
        refNumber: '',
        date: '',
        currency: 'EUR',
        totalTax: 0,
        grossAmount: 0,
        netAmount: 0,
        invoiceLines: [],
    },
};
interface Props {
    id: string;
    tenatsBusinessPartners: BusinessPartners[];
    allBusinessPartners: BusinessPartners[];
    expenseCategory: ExpenseCategory[];
}

const AddApInvoicePage = ({
    id,
    tenatsBusinessPartners,
    allBusinessPartners,
    expenseCategory,
}: Props) => {
    //////////// States ////////////
    const [visible, setVisible] = useState(false);
    const [invoice, setInvoice] = useState<File | string | Blob>();
    const [fileDataURL, setFileDataURL] = useState<null | string>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [popUpVisible, setPopUpVisible] = useState<boolean>(false);
    const [invoiceData, setInvoiceData] = useState<any>(apInvoiceData);
    const [selectedProvider, setSelectedProvider] = useState<BusinessPartners>({
        id: null,
        tenantId: '',
        name: '',
        vatNumber: '',
    });
    const [lines, setLines] = useState({});
    const [analyzedInvoiceLines, setAnalyzedInvoiceLines] = useState<any>(null);
    const [value, setValue] = useState<BusinessPartners>();

    //////////// Refs ////////////
    const inputRef = useRef<HTMLInputElement | null>(null);
    const selectboxRef = useRef<SelectBox>(null);
    const formRef = useRef<Form>(null);
    const serviceDateToRefs = useRef<DateBox[] | any>([]);
    const serviceDateFromRefs = useRef<DateBox[] | any>([]);
    const depreciationRatePerYearRefs = useRef<NumberBox[] | any>([]);

    //////////// Custom Hooks ////////////
    const router = useRouter();
    const searchParams = useSearchParams();
    const docId = searchParams!.get('docId');
    const archiveId = searchParams!.get('archieveId');

    // Toast if BP is not known after analyzing invoice
    useEffect(() => {
        // Check if we are on init state
        if (JSON.stringify(invoiceData) === JSON.stringify(apInvoiceData))
            return;
        // Check if BP was founded by AI
        if (!invoiceData.form.businessPartner.vatNumber && !invoiceData.cif) {
            toast.warn(
                'Business Partner / CIF not found, create a new Business Partner'
            );
            return;
        }
        if (
            !tenatsBusinessPartners.filter(
                (bp) =>
                    bp.vatNumber ===
                        invoiceData.form.businessPartner.vatNumber ||
                    invoiceData.cif
            )[0]
        ) {
            toast.warn(
                'Business Partner not known, create a new Business Partner'
            );
            return;
        }
        setSelectedProvider(invoiceData.form.businessPartner);
    }, [invoiceData, tenatsBusinessPartners]);

    // Function when document is already uploaded in Documents
    useEffect(() => {
        const archiveId = 'c1b1bacc-7a32-41d2-9dc0-e67afc867d0f';
        if (docId !== null && archiveId !== null) {
            const apInvoice = async () => {
                const url = URL.createObjectURL(
                    await downloadDocument(archiveId, docId)
                );
                const doc = await downloadDocument(archiveId, docId);
                setFileDataURL(url);
                setInvoice(doc);
            };
            apInvoice();
        }
    }, [docId, archiveId]);

    // Upload file from computer
    const handleUploadClick = () => {
        inputRef.current?.click();
        setVisible((visible) => !visible);
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setInvoice(e.target.files[0]);
        const fileInput = inputRef.current;
        if (!fileInput?.files) return [];
        const selectedDocuments = [...fileInput.files];
        const toastId = toast.loading('Creating document id');
        try {
            await uploadDocumentsToArchive(
                'c1b1bacc-7a32-41d2-9dc0-e67afc867d0f',
                selectedDocuments
            );
            updateSuccessToast(toastId, 'Document id generated');
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to analyze the uploaded invoice
    const handleAnalyzeInvoice = useCallback(async () => {
        const toastId = toast.loading('Analyzing Invoice');
        const formData = new FormData();

        // Logic when invoice is uploaded or is already uploaded in documents
        const fileInput = inputRef.current;
        if (typeof fileInput === 'object' && fileInput!.files?.length != 0) {
            const selectedDocuments: File[] = [...fileInput?.files!];
            for (const file of selectedDocuments) {
                formData.append('file', file);
            }
        } else {
            const blob = new Blob([invoice as BlobPart], {
                type: 'application/json',
            });
            const blobFile = new File([blob], 'invoice', {
                type: blob!.type,
            });
            formData.append('file', blobFile);
        }

        try {
            const response = await apiPost(
                '/api/accounting/docAnalyzer',
                formData
            );

            let analyzedData: any = response;
            updateSuccessToast(toastId, 'AP Invoice analyzed correctly!');

            if (analyzedData.form.businessPartner.vatNumber == null) {
                analyzedData.form.businessPartner.vatNumber = analyzedData.cif;
            }

            try {
                let invoiceLinesApiCall: InvoiceItemAnalyzer[] = [];
                for (const invoiceLine of analyzedData.form.invoiceLines) {
                    var objInvoiceItemAnalyzer = {
                        vendorName: analyzedData.form.businessPartner.name,
                        invoiceLineDescription: invoiceLine.description,
                    };
                    invoiceLinesApiCall.push(objInvoiceItemAnalyzer);
                }
                const response = await apiPost(
                    '/api/accounting/itemAnalyzer',
                    invoiceLinesApiCall
                );

                console.log('TODO CORRECTO, valores de vuelta: ', response);

                const analyzedInvoiceLine: any = response;
                setAnalyzedInvoiceLines(analyzedInvoiceLine);

                var arrayInvoices: any[] = [];
                analyzedInvoiceLine.forEach(function (elem: any) {
                    expenseCategory.filter(function (elem2: any) {
                        if (elem2.name === elem.predictedCategoryId) {
                            arrayInvoices.push(elem2);
                        }
                    });
                });
                for (let i: number = 0; i < arrayInvoices.length; i++) {
                    analyzedData.form.invoiceLines[i].expenseCategory = {
                        ...arrayInvoices[i],
                    };
                }
            } catch (error: unknown) {
                customError(error, toastId);
            } finally {
                setIsLoading(false);
            }
            setInvoiceData(analyzedData);
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [invoice, expenseCategory]);

    // Function to Save the AP Invoice
    const handleSaveApInvoice = useCallback(async () => {
        const toastId = toast.loading('Saving Invoice');
        setIsLoading(true);
        const id = 'b99f942c-a141-4555-9554-14a09c5f94a4';
        const idBP = '1a78d068-c4bd-4bc8-9630-19bad280ab3d';

        let invoiceLinesAPInvoice: InvoiceLines[] = [];

        for (const invoiceLine of invoiceData.form.invoiceLines) {
            invoiceLinesAPInvoice.push({
                ...invoiceLine,
                expenseCategoryId: invoiceLine.expenseCategory.id,
                depreciationRatePerYear: 0,
                serviceDateFrom: null,
                serviceDateTo: null,
            });
        }

        const valuesToSend: ApInvoice = {
            ...invoiceData.form,
            //businessPartnerId: invoiceData.form.businessPartner.id,
            businessPartnerId: idBP,
            currency: 'EUR',
            invoiceLines: invoiceLinesAPInvoice,
        };

        try {
            console.log('Valores a enviar: ', valuesToSend);
            console.log(
                'Valores a enviar en JSON: ',
                JSON.stringify(valuesToSend)
            );

            const data = await apiPostAccounting(
                '/api/accounting/apInvoices',
                id!,
                valuesToSend
            );

            console.log('TODO CORRECTO, valores de vuelta: ', data);

            updateSuccessToast(toastId, 'AP Invoice saved correctly!');

            // Pass the ref number + date to reload the page
            router.push(
                `/private/accounting/${id}/expenses?createdInvoice=${
                    data.refNumber + data.date
                }`
            );
            // Reset invoice data
            setInvoiceData(apInvoiceData);
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [invoiceData, router]);

    useEffect(() => {
        let fileReader: any,
            isCancel: boolean = false;
        if (invoice) {
            fileReader = new FileReader();
            fileReader.onload = (e: any) => {
                const { result } = e.target;
                if (result && !isCancel) {
                    setFileDataURL(result);
                }
            };
            fileReader.readAsDataURL(invoice);
        }
        return () => {
            isCancel = true;
            if (fileReader && fileReader.readyState === 1) {
                fileReader.abort();
            }
        };
    }, [invoice]);

    // Remove BP that are already related to the tenant
    let totalBP = allBusinessPartners.filter(
        (u) => tenatsBusinessPartners.findIndex((lu) => lu.id === u.id) === -1
    );

    // Adding new BP to selectbox Provider
    useEffect(() => {
        if (value === undefined) return;
        const arrayBP: any = tenatsBusinessPartners.unshift(value);
        selectboxRef.current!.instance.option('items', arrayBP);
    }, [value, tenatsBusinessPartners]);

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
        // TODO INDEX EMPTY
        console.log(e);
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

    return (
        <div className='absolute inset-4 w-screen'>
            <div className='h-full'>
                <BpPopup
                    message='Adding a new Business Partner'
                    isVisible={popUpVisible}
                    onClose={() => setPopUpVisible(false)}
                    id={id}
                    allBusinessPartners={totalBP}
                    setValue={setValue}
                />
                <ToolbarTooltipsApInvoice />
                <Allotment defaultSizes={[65, 35]}>
                    <Allotment.Pane>
                        <div className='h-full'>
                            <div className='mr-2 flex flex-row justify-end'>
                                <div className='flex gap-4'>
                                    <div className='w-10'>
                                        <Button
                                            id='saveButton'
                                            icon={faFloppyDisk}
                                            onClick={handleSaveApInvoice}
                                            disabled={!invoice}
                                        />
                                    </div>
                                    <div className='w-10'>
                                        <Button
                                            id='analyzeButton'
                                            icon={faGears}
                                            iconPosition={'leading'}
                                            onClick={handleAnalyzeInvoice}
                                            disabled={!invoice}
                                        />
                                    </div>
                                    <div className='w-10'>
                                        <input
                                            type='file'
                                            ref={inputRef}
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                        <Button
                                            onClick={handleUploadClick}
                                            id='uploadButton'
                                            size={'base'}
                                            style={'outline'}
                                            icon={faUpload}
                                            iconPosition={'leading'}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='h-[95%] overflow-y-auto overflow-x-hidden'>
                                <Form
                                    formData={invoiceData}
                                    labelLocation='left'
                                    ref={formRef}
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
                                                value={
                                                    selectedProvider!.vatNumber
                                                }
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
                                            <RequiredRule />
                                        </Item>
                                        <SimpleItem
                                            dataField='form.refNumber'
                                            label={{ text: 'Invoice Number' }}
                                        >
                                            <RequiredRule />
                                        </SimpleItem>
                                        <SimpleItem
                                            dataField='form.businessPartner.vatNumber'
                                            label={{ text: 'CIF' }}
                                        >
                                            <RequiredRule />
                                        </SimpleItem>
                                        <SimpleItem
                                            dataField='form.date'
                                            label={{ text: 'Date of invoice' }}
                                            editorType='dxDateBox'
                                            editorOptions={{
                                                displayFormat: dateFormat,
                                            }}
                                        >
                                            <RequiredRule />
                                        </SimpleItem>
                                    </GroupItem>
                                </Form>
                                <Form
                                    formData={invoiceData}
                                    labelMode='static'
                                    className='mr-2'
                                    ref={formRef}
                                >
                                    <GroupItem caption={`Items/Lines`}>
                                        {invoiceData.form.invoiceLines.map(
                                            (invoice: any, index: number) => {
                                                return (
                                                    <GroupItem
                                                        key={`GroupItem${index}`}
                                                        colCount={16}
                                                        cssClass='pb-2 border-dotted border-b-2 border-primary-500'
                                                    >
                                                        <Item
                                                            key={`code${index}`}
                                                            dataField={`form.invoiceLines[${index}].expenseCategory.expenseTypeCode`}
                                                            label={{
                                                                text: 'Code',
                                                            }}
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
                                                                onValueChanged={
                                                                    changeCostType
                                                                }
                                                                defaultValue={
                                                                    invoiceData
                                                                        .form
                                                                        .invoiceLines[
                                                                        index
                                                                    ]
                                                                        .expenseCategory
                                                                        .expenseTypeCode
                                                                }
                                                            />
                                                        </Item>
                                                        <Item
                                                            key={`categorie${index}`}
                                                            dataField={`form.invoiceLines[${index}].expenseCategory.name`}
                                                            label={{
                                                                text: 'Code',
                                                            }}
                                                            colSpan={4}
                                                            cssClass='itemStyle'
                                                        />
                                                        <Item
                                                            key={`description${index}`}
                                                            dataField={`form.invoiceLines[${index}].description`}
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
                                                            dataField={`form.invoiceLines[${index}].serviceDateFrom`}
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
                                                            dataField={`form.invoiceLines[${index}].serviceDateTo`}
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
                                                            dataField={`form.invoiceLines[${index}].depreciationRatePerYear`}
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
                                                                label='Depreciation'
                                                            />
                                                        </Item>
                                                        <Item
                                                            key={`quantity${index}`}
                                                            dataField={`form.invoiceLines[${index}].quantity`}
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
                                                            dataField={`form.invoiceLines[${index}].tax`}
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
                                                            dataField={`form.invoiceLines[${index}].discount`}
                                                            label={{
                                                                text: 'DTO %',
                                                            }}
                                                            editorOptions={{
                                                                format: "#0.##'%'",
                                                            }}
                                                            cssClass='itemStyle'
                                                        ></Item>
                                                        <Item
                                                            key={`unitPrice${index}`}
                                                            dataField={`form.invoiceLines[${index}].unitPrice`}
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
                                                            dataField={`form.invoiceLines[${index}].totalPrice`}
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
                                                                    invoiceData.form.invoiceLines.splice(
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
                                                invoiceData.form.invoiceLines.push(
                                                    {
                                                        description: '',
                                                        tax: null,
                                                        discount: null,
                                                        quantity: null,
                                                        unitPrice: null,
                                                        expenseCategory: {
                                                            id: null,
                                                            name: null,
                                                            expenseTypeCode:
                                                                null,
                                                        },
                                                        expenseCategoryId: '',
                                                        depreciationRatePerYear:
                                                            null,
                                                        serviceDateFrom: '',
                                                        serviceDateTo: '',
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
                                        formData={invoiceData}
                                        labelLocation='left'
                                        className='mr-2'
                                    >
                                        <GroupItem>
                                            <Item
                                                dataField='form.grossAmount'
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
                                                dataField='form.netAmount'
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
                    <Allotment.Pane>
                        <div className='ml-2'>
                            {!invoice && (
                                <div className='flex h-screen items-center justify-center'>
                                    <h1 className='text-center text-xl'>
                                        Please upload a AP Invoice
                                    </h1>
                                </div>
                            )}
                            <PreviewWrapper file={fileDataURL} />
                        </div>
                    </Allotment.Pane>
                </Allotment>
            </div>
        </div>
    );
};

export default AddApInvoicePage;
