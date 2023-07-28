import React from 'react';

interface Props {
    file: any;
}

const PreviewWrapper = ({ file }: Props) => {
    return (
        <div>
            <iframe
                src={file}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: '5px',
                    bottom: 0,
                    right: 0,
                    width: '92%',
                    height: '100%',
                }}
            ></iframe>
        </div>
    );
};

export default PreviewWrapper;
