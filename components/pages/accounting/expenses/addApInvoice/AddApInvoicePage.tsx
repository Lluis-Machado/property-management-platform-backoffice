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

// Local imports
import { Button } from 'pg-components';
import PreviewWrapper from './PreviewWrapper';
import '../../../../../node_modules/allotment/dist/style.css';
import '../../../../splitPane/style/splitPane.module.css';
import { apiPost } from '@/lib/utils/apiPost';
import { customError } from '@/lib/utils/customError';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import { TokenRes } from '@/lib/types/token';
import { data } from './invoiceData';
import { dateFormat } from '@/lib/utils/datagrid/customFormats';

interface Props {
    token: TokenRes;
    id: string;
}

const AddApInvoicePage = ({ token, id }: Props) => {
    const [visible, setVisible] = useState(false);
    const [file, setFile] = useState<File>();
    const [fileDataURL, setFileDataURL] = useState(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [invoiceData, setInvoiceData] = useState<any>(data);
    const [lines, setLines] = useState({});
    const router = useRouter();

    const handleUploadClick = () => {
        inputRef.current?.click();
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setVisible((visible) => !visible);
        if (!e.target.files) {
            return;
        }
        setFile(e.target.files[0]);
    };
    console.log(token);

    const handleSubmit = useCallback(async () => {
        const toastId = toast.loading('Creating contact...');
        try {
            console.log('Valores a enviar: ', file);
            console.log('Valores a enviar en JSON: ', JSON.stringify(file));

            const data = await apiPost(
                '/docanalyzer/DocumentAnalyzer/APInvoice',
                file,
                token,
                'Error while analyzing AP Invoice'
            );

            console.log('TODO CORRECTO, valores de vuelta: ', data);
            setInvoiceData(data);

            updateSuccessToast(toastId, 'AP Invoice analyzed correctly!');
            //Router.push('/private/contacts');
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [token, file]);

    const handleSave = useCallback(async () => {
        const toastId = toast.loading('Saving Invoice');
        try {
            console.log('Valores a enviar: ', invoiceData);
            console.log(
                'Valores a enviar en JSON: ',
                JSON.stringify(invoiceData)
            );

            const data = await apiPost(
                `/accounting/tenants/${id}/businesspartners/${invoiceData.form.businessPartner.vatNumber}/apinvoices`,
                invoiceData,
                token,
                'Error saving AP Invoice'
            );

            console.log('TODO CORRECTO, valores de vuelta: ', data);
            updateSuccessToast(toastId, 'AP Invoice analyzed correctly!');
            router.push(`/accounting/${id}/expenses`);
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [token, invoiceData, id, router]);

    const handleDisabled = () => {
        if (!invoiceData) {
            return true;
        }
        return false;
    };

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

    return (
        <div className='absolute inset-4 w-screen'>
            <div className='h-full'>
                <Allotment defaultSizes={[70, 30]}>
                    <Allotment.Pane>
                        <div className='mr-4'>
                            <div className='flex justify-end gap-4'>
                                <div className='w-24'>
                                    <Button
                                        text='Analyse'
                                        icon={faGears}
                                        iconPosition={'leading'}
                                    />
                                </div>
                                <div className='w-24'>
                                    <input
                                        type='file'
                                        ref={inputRef}
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                    <Button
                                        onClick={handleUploadClick}
                                        text='Upload'
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
                                    <SimpleItem
                                        dataField='form.businessPartner.name'
                                        label={{ text: 'Provider' }}
                                    />
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
                                    />
                                </GroupItem>
                            </Form>
                            <Form formData={invoiceData} labelMode='static'>
                                <GroupItem caption={`Items/Lines`}>
                                    {invoiceData.form.invoiceLines.map(
                                        (invoice: any, index: number) => {
                                            return (
                                                <GroupItem
                                                    key={`GroupItem${index}`}
                                                    colCount={14}
                                                >
                                                    <Item
                                                        key={`description${index}`}
                                                        dataField={`form.invoiceLines[${index}].description`}
                                                        label={{
                                                            text: 'Description',
                                                        }}
                                                        colSpan={2}
                                                    />
                                                    <Item
                                                        key={`code${index}`}
                                                        dataField={`form.invoiceLines[${index}].code`}
                                                        label={{ text: 'Code' }}
                                                    />
                                                    <Item
                                                        key={`category${index}`}
                                                        dataField={`form.invoiceLines[${index}].category`}
                                                        label={{
                                                            text: 'Category',
                                                        }}
                                                        colSpan={2}
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
                                                    />
                                                    <Item
                                                        key={`depreciationRatePerYear${index}`}
                                                        dataField={`form.invoiceLines[${index}].depreciationRatePerYear`}
                                                        label={{
                                                            text: 'Deprication',
                                                        }}
                                                    />
                                                    <Item
                                                        key={`quantity${index}`}
                                                        dataField={`form.invoiceLines[${index}].quantity`}
                                                        label={{
                                                            text: 'Amout',
                                                        }}
                                                    />
                                                    <Item
                                                        key={`unitPrice${index}`}
                                                        dataField={`form.invoiceLines[${index}].unitPrice`}
                                                        label={{
                                                            text: 'Unit Price',
                                                        }}
                                                    />
                                                    <Item
                                                        key={`tax${index}`}
                                                        dataField={`form.invoiceLines[${index}].tax`}
                                                        label={{
                                                            text: 'Taxes',
                                                        }}
                                                    />
                                                    <Item
                                                        key={`button${index}`}
                                                        itemType='button'
                                                        horizontalAlignment='left'
                                                        buttonOptions={{
                                                            icon: 'trash',
                                                            onClick: () => {
                                                                // Set a new empty line
                                                                invoiceData.form.invoiceline.splice(
                                                                    index,
                                                                    1
                                                                );
                                                                // Update items fields
                                                                setLines([]);
                                                            },
                                                        }}
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
                                        dataField='form.totalAmount'
                                        label={{ text: 'Total Amout' }}
                                    />
                                </GroupItem>
                            </Form>
                            <div className='mt-10 flex justify-center'>
                                <div className='w-32'>
                                    <Button
                                        text='Save Invoice'
                                        icon={faFloppyDisk}
                                        onClick={handleSave}
                                        disabled={handleDisabled()}
                                    />
                                </div>
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
