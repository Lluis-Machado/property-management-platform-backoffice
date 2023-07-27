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

const AddApInvoicePage = () => {
    const [visible, setVisible] = useState(false);
    const [file, setFile] = useState<File>();
    const [fileDataURL, setFileDataURL] = useState(null);
    console.log(fileDataURL);
    const inputRef = useRef<HTMLInputElement | null>(null);
    console.log(file);

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
        <>
            <div>
                <div className='mt-4 flex h-screen w-screen gap-2'>
                    <div className='flex-1'>
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
                    <div className='w-fit flex-1'>
                        <PreviewWrapper file={fileDataURL} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddApInvoicePage;
