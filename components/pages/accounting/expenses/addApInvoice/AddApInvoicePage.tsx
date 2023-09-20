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
import Form, { GroupItem, Item, SimpleItem } from 'devextreme-react/form';
import { useRouter } from 'next/navigation';
import { PDFDocument } from 'pdf-lib';

// Local imports
import '../../../../../lib/styles/formItems.css';
import { Button } from 'pg-components';
import PreviewWrapper from './PreviewWrapper';
import '../../../../../node_modules/allotment/dist/style.css';
import '../../../../splitPane/style/splitPane.module.css';
import { customError } from '@/lib/utils/customError';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import { TokenRes } from '@/lib/types/token';
import { dateFormat } from '@/lib/utils/datagrid/customFormats';
import { uploadDocumentsToArchive } from '@/lib/utils/documents/apiDocuments';
import {
    documentMessages,
    makeApiRequest,
} from '@/lib/utils/accounting/apiAccounting';
import { apiPost } from '@/lib/utils/apiPost';
import { BusinessPartners } from '@/lib/types/businessPartners';
import { ApInvoice, ApInvoiceAnalyzedData } from '@/lib/types/apInvoice';
import BpPopup from '@/components/popups/BpPopup';
import ToolbarTooltipsApInvoice from '@/components/tooltips/ToolbarTooltipsApInvoice';
import SelectBox from 'devextreme-react/select-box';

const BASE_END_POINT = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}`;

let apInvoiceData: ApInvoiceAnalyzedData = {
    form: {
        businessPartner: {
            name: '',
            vatNumber: '',
        },
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
    token: TokenRes;
    id: string;
    tenatsBusinessPartners: BusinessPartners[];
    allBusinessPartners: BusinessPartners[];
}

const AddApInvoicePage = ({
    token,
    id,
    tenatsBusinessPartners,
    allBusinessPartners,
}: Props) => {
    const [pdfDocument, setPdfDocument] = useState<any>();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const selectboxRef = useRef<any>();
    const [visible, setVisible] = useState(false);
    const [file, setFile] = useState<File>();
    const [fileDataURL, setFileDataURL] = useState(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [popUpVisible, setPopUpVisible] = useState<boolean>(false);
    const [invoiceData, setInvoiceData] = useState<any>(apInvoiceData);
    const [selectedProvider, setSelectedProvider] =
        useState<BusinessPartners>();
    const [lines, setLines] = useState({});
    const [analyzedInvoiceLines, setAnalyzedInvoiceLines] = useState<any>(null);
    const router = useRouter();

    // Toast if BP is not known after annalyzing invoice
    useEffect(() => {
        // Check if we are on init state
        if (JSON.stringify(invoiceData) === JSON.stringify(apInvoiceData))
            return;
        const invoiceBp = invoiceData.form.businessPartner;
        // Check if BP was founded by AI
        if (!invoiceBp.vatNumber) {
            toast.warn('Busniness Partner not found');
            return;
        }
        if (
            !tenatsBusinessPartners.filter(
                (bp) => bp.vatNumber === invoiceBp.vatNumber
            )[0]
        ) {
            toast.warn(
                'Busniness Partner not known, create a new Business Partner'
            );
            return;
        }
        setSelectedProvider(invoiceBp);
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
        const toastId = toast.loading('Annalyzing Invoice');
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
    }, [token]);

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
            // Reset invoice data
            setInvoiceData(apInvoiceData);
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [invoiceData, router, token]);

    useEffect(() => {
        let fileReader: any,
            isCancel: boolean = false;
        if (file) {
            fileReader = new FileReader();
            fileReader.onload = (e: any) => {
                const { result } = e.target;
                console.log(result);
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
        const arrayBP = tenatsBusinessPartners.unshift(value);
        selectboxRef.current!.instance.option('items', arrayBP);
    }, [value, tenatsBusinessPartners]);

    return (
        <div className='absolute inset-4 w-screen'>
            <div className='h-full'>
                <BpPopup
                    message='Adding a new Business Partner'
                    isVisible={popUpVisible}
                    onClose={() => setPopUpVisible(false)}
                    token={token}
                    id={id}
                    allBusinessPartners={totalBP}
                    setValue={setValue}
                />

                <ToolbarTooltipsApInvoice />
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
                                                    {/* <Item
                                                        key={`tax${index}`}
                                                        dataField={`form.invoiceLines[${index}].tax`}
                                                        label={{
                                                            text: 'IVA',
                                                        }}
                                                        editorType='dxSelectBox'
                                                        editorOptions={{
                                                            items: [
                                                                {
                                                                    label: '4%',
                                                                    value: 4,
                                                                },
                                                                {
                                                                    label: '5%',
                                                                    value: 5,
                                                                },
                                                                {
                                                                    label: '10%',
                                                                    value: 10,
                                                                },
                                                                {
                                                                    label: '21%',
                                                                    value: 21,
                                                                },
                                                            ],
                                                            displayExpr:
                                                                'label',
                                                            valueExpr: 'value',
                                                            searchEnabled: true,
                                                        }}
                                                        cssClass='itemStyle'
                                                    /> */}
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
