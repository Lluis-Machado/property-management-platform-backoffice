'use client';

//React imports
import { ChangeEvent, useRef, useState } from 'react';
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

    return (
        <>
            <div className='w-128 h-128'>
                <Allotment
                    onVisibleChange={(_index, value) => {
                        setVisible(value);
                    }}
                >
                    <Allotment.Pane>
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
                    </Allotment.Pane>

                    <Allotment.Pane visible={visible}>
                        <PreviewWrapper file={file} />
                    </Allotment.Pane>
                </Allotment>
            </div>
        </>
    );
};

export default AddApInvoicePage;
