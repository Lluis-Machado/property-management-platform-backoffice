import React from 'react';

interface Props {
    file: any;
}

const PreviewWrapper = ({ file }: Props) => {
    console.log(file);
    return (
        <>
            <iframe
                src={file}
                //name={file.name}
            />
        </>
    );
};

export default PreviewWrapper;
