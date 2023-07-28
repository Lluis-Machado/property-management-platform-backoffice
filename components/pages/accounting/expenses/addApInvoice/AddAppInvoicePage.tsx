'use client';

//React imports
import { ChangeEvent, useEffect, useRef, useState } from 'react';
// Libraries imports
import { Allotment } from 'allotment';

// Local imports
import { Button } from 'pg-components';
import PreviewWrapper from './PreviewWrapper';
import CreateInvoiceForm from './Form';
import { faGears, faUpload } from '@fortawesome/free-solid-svg-icons';
import '../../../../../node_modules/allotment/dist/style.css';
import '../../../../splitPane/style/splitPane.module.css';

const AddApInvoicePage = () => {
    const [visible, setVisible] = useState(false);
    const [file, setFile] = useState<File>();
    const [fileDataURL, setFileDataURL] = useState(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleUploadClick = () => {
        inputRef.current?.click();
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setVisible((visible) => !visible);
        if (!e.target.files) {
            return;
        }

        setFile(e.target.files[0]);
        // API CALL
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
        <div className='h-screen w-screen'>
            <Allotment>
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
                        <CreateInvoiceForm />
                    </div>
                </Allotment.Pane>
                <Allotment.Pane>
                    <div className='ml-2'>
                        <PreviewWrapper file={fileDataURL} />
                    </div>
                </Allotment.Pane>
            </Allotment>
        </div>
    );
};

export default AddApInvoicePage;
