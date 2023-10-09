import Tooltip from 'devextreme-react/tooltip';

const ToolbarTooltipsApInvoice = () => {
    return (
        <>
            <Tooltip
                target='#saveButton'
                showEvent='mouseenter'
                hideEvent='mouseleave'
            >
                <div className='text-base text-primary-700'>Save Invoice</div>
            </Tooltip>
            <Tooltip
                target='#analyzeButton'
                showEvent='mouseenter'
                hideEvent='mouseleave'
            >
                <div className='text-base text-primary-700'>
                    Analyze Invoice
                </div>
            </Tooltip>
            <Tooltip
                target='#uploadButton'
                showEvent='mouseenter'
                hideEvent='mouseleave'
            >
                <div className='text-base text-primary-700'>Upload Invoice</div>
            </Tooltip>
        </>
    );
};

export default ToolbarTooltipsApInvoice;
