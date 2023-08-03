'use client';

import 'allotment/dist/style.css';
import { Allotment } from 'allotment';
import styles from './style/splitPane.module.css';
import SplitDocumentForm from '@/components/pages/documents/splitDocument/SplitDocumentForm';

const page = () => {
    return (
        <div className='h-screen w-screen'>
            <Allotment>
                <Allotment.Pane>
                    <div className='mr-4'>
                        {/* <div className='flex justify-end gap-4'>
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
                        </div> */}
                        <SplitDocumentForm />
                    </div>
                </Allotment.Pane>
                <Allotment.Pane>
                    <div className='ml-2'>
                        <iframe className='h-full w-full' src={undefined} />
                    </div>
                </Allotment.Pane>
            </Allotment>
        </div>
    );
};

export default page;
