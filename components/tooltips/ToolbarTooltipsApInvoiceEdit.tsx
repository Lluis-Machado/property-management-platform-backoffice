import Tooltip from 'devextreme-react/tooltip';

const ToolbarTooltipsApInvoiceEdit = () => {
    return (
        <>
            <Tooltip
                target='#saveButton'
                showEvent='mouseenter'
                hideEvent='mouseleave'
            >
                <div className='text-base text-primary-700'>
                    Save changes Invoice
                </div>
            </Tooltip>
        </>
    );
};

export default ToolbarTooltipsApInvoiceEdit;
