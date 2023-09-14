import Tooltip from 'devextreme-react/tooltip';

const ToolbarTooltipsApInvoice = () => {
    return (
        <>
            <Tooltip
                target='#saveButton'
                showEvent='mouseenter'
                hideEvent='mouseleave'
            >
                <div className='text-base text-primary-700'>Save</div>
            </Tooltip>
            <Tooltip
                target='#annalyzeButton'
                showEvent='mouseenter'
                hideEvent='mouseleave'
            >
                <div className='text-base text-primary-700'>
                    Annalyze Invoice
                </div>
            </Tooltip>
            <Tooltip
                target='#uploadButton'
                showEvent='mouseenter'
                hideEvent='mouseleave'
            >
                <div className='text-base text-primary-700'>Upload</div>
            </Tooltip>
        </>
    );
};

export default ToolbarTooltipsApInvoice;
