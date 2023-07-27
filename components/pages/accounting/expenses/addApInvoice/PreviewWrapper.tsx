import React from 'react';

interface Props {
    file: any;
}

const PreviewWrapper = ({ file }: Props) => {
    console.log(file);
    return (
        <div className='w-1/2'>
            <iframe src={file}></iframe>
        </div>
    );
};

export default PreviewWrapper;
