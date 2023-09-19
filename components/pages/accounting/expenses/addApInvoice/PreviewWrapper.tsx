import React from 'react';

interface Props {
    file: any;
}

const PreviewWrapper = ({ file }: Props) => {
    return (
        <div>
            <iframe
                src={file}
                height='100%'
                width='90%'
                style={{
                    position: 'absolute',
                    top: 0,
                    left: '5px',
                    bottom: 0,
                    right: 0,
                }}
            ></iframe>
        </div>
    );
};
export default PreviewWrapper;
