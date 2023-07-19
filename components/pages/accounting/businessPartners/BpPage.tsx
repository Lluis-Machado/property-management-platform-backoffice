import React from 'react';

import BpDataGrid from './BpDataGrid';

interface Props {
    data: any;
}

const BpPage = ({ data }: Props) => {
    return (
        <>
            <BpDataGrid dataSource={data} />
        </>
    );
};

export default BpPage;
