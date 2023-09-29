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
import { useRouter } from 'next/navigation';
import DateBox from 'devextreme-react/date-box';
import { ValueChangedEvent } from 'devextreme/ui/date_box';
import SelectBox from 'devextreme-react/select-box';
import { Tooltip } from 'devextreme-react/tooltip';

// Local imports
import '@/lib/styles/formItems.css';
import { Button } from 'pg-components';
import PreviewWrapper from './PreviewWrapper';
import '@/node_modules/allotment/dist/style.css';
import '../../../../splitPane/style/splitPane.module.css';
import { customError } from '@/lib/utils/customError';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import { dateFormat } from '@/lib/utils/datagrid/customFormats';
import { uploadDocumentsToArchive } from '@/lib/utils/documents/apiDocuments';
import {
    documentMessages,
    makeApiRequest,
} from '@/lib/utils/accounting/apiAccounting';
import { BusinessPartners } from '@/lib/types/businessPartners';
import { ApInvoice, ApInvoiceAnalyzedData } from '@/lib/types/apInvoice';
import BpPopup from '@/components/popups/BpPopup';
import ToolbarTooltipsApInvoice from '@/components/tooltips/ToolbarTooltipsApInvoice';
import TextBox from 'devextreme-react/text-box';
import { apiPostAccounting } from '@/lib/utils/apiPostAccounting';

const BASE_END_POINT = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}`;

let apInvoiceData: ApInvoiceAnalyzedData = {
    form: {
        businessPartnerId: '',
        // businessPartnerName: '',
        // businessPartnerVatNumber: '',
        refNumber: '',
        date: '',
        currency: 'EUR',
        totalAmount: 0,
        totalBaseAmount: 0,
        totalTax: 0,
        totalTaxPercentage: 0,
        invoiceLines: [],
    },
};
interface Props {
    id: string;
    tenatsBusinessPartners: BusinessPartners[];
    allBusinessPartners: BusinessPartners[];
}

const AddApInvoicePage = ({
    id,
    tenatsBusinessPartners,
    allBusinessPartners,
}: Props) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const selectboxRef = useRef<SelectBox>(null);
    const formRef = useRef<Form>(null);
    const dateboxRefFrom = useRef<any>(null);
    const dateboxRefTo = useRef<any>(null);
    const [visible, setVisible] = useState(false);
    const [file, setFile] = useState<File>();
    const [fileDataURL, setFileDataURL] = useState(null);
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
    const router = useRouter();

    // Toast if BP is not known after annalyzing invoice
    useEffect(() => {
        // Check if we are on init state
        if (JSON.stringify(invoiceData) === JSON.stringify(apInvoiceData))
            return;
        // Check if BP was founded by AI
        if (!invoiceData.form.businessPartner.vatNumber && !invoiceData.cif) {
            toast.warn(
                'Busniness Partner / CIF not found, create a new Business Partner'
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
                'Busniness Partner not known, create a new Business Partner'
            );
            return;
        }
        setSelectedProvider(invoiceData.form.businessPartner);
    }, [invoiceData, tenatsBusinessPartners]);

    const handleUploadClick = () => {
        inputRef.current?.click();
        setVisible((visible) => !visible);
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setFile(e.target.files[0]);
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

    const handleAnnalyzeInvoice = useCallback(async () => {
        const toastId = toast.loading('Analyzing Invoice');
        let analyzedData;
        const fileInput = inputRef.current;
        if (!fileInput?.files) return [];
        const selectedDocuments = [...fileInput.files];

        const formData = new FormData();
        for (const file of selectedDocuments) {
            formData.append('file', file);
        }
        const aux =
            formData instanceof FormData ? formData : JSON.stringify(formData);

        const endPoint = `${BASE_END_POINT}/docanalyzer/DocumentAnalyzer/APInvoice`;
        try {
            const response = await makeApiRequest(
                endPoint,
                'POST',
                documentMessages.upload,
                token,
                aux
            );

            analyzedData = await response.json();
            updateSuccessToast(toastId, 'AP Invoice analyzed correctly!');

            //Calculate total price
            for (const invoiceLine of analyzedData.form.invoiceLines) {
                const totalLinePrice =
                    invoiceLine.unitPrice * invoiceLine.quantity;
                invoiceLine['totalLinePrice'] = totalLinePrice;
            }

            if (analyzedData.form.businessPartner.vatNumber == null) {
                analyzedData.form.businessPartner.vatNumber = analyzedData.cif;
            }

            setInvoiceData(analyzedData);
            try {
                const endPoint = `${BASE_END_POINT}/invoiceitemanalyzer/Predict`;
                let invoiceLinesApiCall: any[] = [];
                for (const invoiceLine of analyzedData.form.invoiceLines) {
                    const hasPeriod =
                        invoiceLine.serviceDateFrom == null &&
                        invoiceLine.serviceDateTo == null
                            ? false
                            : true;
                    var objInvoiceItemAnalyzer = {
                        vendorName: analyzedData.form.businessPartner.name,
                        vendorTaxId:
                            analyzedData.form.businessPartner.vatNumber,
                        invoiceLineDescription: invoiceLine.description,
                        hasPeriod: hasPeriod,
                    };
                    invoiceLinesApiCall.push(objInvoiceItemAnalyzer);
                }
                const response = await makeApiRequest(
                    endPoint,
                    'POST',
                    documentMessages.upload,
                    token,
                    invoiceLinesApiCall,
                    true
                );
                const analyzedInvoiceLine = await response.json();
                setAnalyzedInvoiceLines(analyzedInvoiceLine);
            } catch (error: unknown) {
                customError(error, toastId);
            } finally {
                setIsLoading(false);
            }
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSaveApInvoice = useCallback(async () => {
        const toastId = toast.loading('Saving Invoice');
        setIsLoading(true);
        const id = 'b99f942c-a141-4555-9554-14a09c5f94a4';
        const idBP = 'a44a9fca-02b5-45d8-a0a4-d300753eec37';

        let invoiceLinesAPInvoice: any[] = [];

        for (const invoiceLine of invoiceData.form.invoiceLines) {
            invoiceLinesAPInvoice.push({
                ...invoiceLine,
                expenseCategoryId: '1996e66c-80b2-4c5f-8411-b84efd29393f',
                depreciationRatePerYear: 0,
                serviceDateFrom: '2023-09-19T09:14:41.861Z',
                serviceDateTo: '2023-09-19T09:14:41.861Z',
            });
        }

        const valuesToSend: ApInvoice = {
            businessPartnerId: idBP,
            // businessPartnerName: invoiceData.form.businessPartnerName,
            // businessPartnerVatNumber: invoiceData.form.businessPartnerVatNumber,
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
        if (file) {
            fileReader = new FileReader();
            fileReader.onload = (e: any) => {
                const { result } = e.target;
                if (result && !isCancel) {
                    setFileDataURL(result);
                }
            };
            fileReader.readAsDataURL(file);
        }
        return () => {
            isCancel = true;
            if (fileReader && fileReader.readyState === 1) {
                fileReader.abort();
            }
        };
    }, [file]);

    // Remove BP that are already related to the tenant
    let totalBP = allBusinessPartners.filter(
        (u) => tenatsBusinessPartners.findIndex((lu) => lu.id === u.id) === -1
    );
    const [value, setValue] = useState<BusinessPartners>();

    // Adding new BP to selectbox Provider
    useEffect(() => {
        if (value === undefined) return;
        const arrayBP: any = tenatsBusinessPartners.unshift(value);
        selectboxRef.current!.instance.option('items', arrayBP);
    }, [value, tenatsBusinessPartners]);

    // Format date and set max/min dates
    const validateDateTo = (e: ValueChangedEvent) => {
        dateboxRefFrom.current!.instance.option('max', new Date(e.value));
        dateboxRefTo.current!.instance.option('displayFormat', dateFormat);
    };

    const validateDateFrom = (e: ValueChangedEvent) => {
        dateboxRefTo.current!.instance.option('min', new Date(e.value));
        dateboxRefFrom.current!.instance.option('displayFormat', dateFormat);
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
    const CostTypeFieldRender = (data: any) => {
        const input = data || {};
        if (data === null) {
            if (input) {
                (input.label = undefined), (input.index = 0);
            }
        }
        return (
            <div className='bg-flex flex h-9 flex-row items-center gap-2 text-center'>
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
                        <div className='h-full overflow-y-auto overflow-x-hidden'>
                            <div className='mr-2 flex flex-row justify-end gap-4'>
                                <div className='w-10'>
                                    <Button
                                        id='saveButton'
                                        icon={faFloppyDisk}
                                        onClick={handleSaveApInvoice}
                                        disabled={!file}
                                    />
                                </div>
                                <div className='w-10'>
                                    <Button
                                        id='annalyzeButton'
                                        icon={faGears}
                                        iconPosition={'leading'}
                                        onClick={handleAnnalyzeInvoice}
                                        disabled={!file}
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
                            <Form
                                formData={invoiceData}
                                labelLocation='left'
                                ref={formRef}
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
                                            value={selectedProvider!.vatNumber}
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
                            >
                                <GroupItem caption={`Items/Lines`}>
                                    {invoiceData.form.invoiceLines.map(
                                        (invoice: any, index: number) => {
                                            return (
                                                <GroupItem
                                                    key={`GroupItem${index}`}
                                                    colCount={8}
                                                    cssClass='pb-2 border-dotted border-b-2 border-primary-500'
                                                >
                                                    <Item
                                                        key={`code${index}`}
                                                        dataField={`form.invoiceLines[${index}].quantity`}
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
                                                        />
                                                    </Item>
                                                    <Item
                                                        key={`categorie${index}`}
                                                        dataField={`analyzedInvoiceLines[${index}].predictedCategoryId`}
                                                        label={{
                                                            text: 'Code',
                                                        }}
                                                        colSpan={2}
                                                        cssClass='itemStyle'
                                                    />
                                                    <Item
                                                        key={`description${index}`}
                                                        dataField={`form.invoiceLines[${index}].description`}
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
                                                        dataField={`form.invoiceLines[${index}].serviceDateFrom`}
                                                        label={{ text: 'From' }}
                                                        cssClass='itemStyle'
                                                    >
                                                        <DateBox
                                                            label={'From'}
                                                            ref={dateboxRefFrom}
                                                            onValueChanged={
                                                                validateDateFrom
                                                            }
                                                        />
                                                    </Item>
                                                    <Item
                                                        key={`serviceDateTo${index}`}
                                                        dataField={`form.invoiceLines[${index}].serviceDateTo`}
                                                        label={{ text: 'To' }}
                                                        cssClass='itemStyle'
                                                    >
                                                        <DateBox
                                                            label={'To'}
                                                            ref={dateboxRefTo}
                                                            onValueChanged={
                                                                validateDateTo
                                                            }
                                                        />
                                                    </Item>
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
                                                    >
                                                        <RequiredRule />
                                                    </Item>
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
                            <div className='float-right w-1/6'>
                                <Form
                                    formData={invoiceData}
                                    labelLocation='left'
                                    className='mr-2'
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
                        </div>
                    </Allotment.Pane>
                    <Allotment.Pane>
                        <div className='ml-2'>
                            {!file && (
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
