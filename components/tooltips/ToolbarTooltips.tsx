import Tooltip from 'devextreme-react/tooltip';

interface Props {
    isEditing: boolean;
}

const ToolbarTooltips = ({ isEditing }: Props) => {
    return (
        <>
            <Tooltip
                target='#crmButton'
                showEvent='mouseenter'
                hideEvent='mouseleave'
            >
                <div className='text-base text-primary-700'>CRM</div>
            </Tooltip>
            <Tooltip
                target='#saveButton'
                showEvent='mouseenter'
                hideEvent='mouseleave'
            >
                <div className='text-base text-primary-700'>Save</div>
            </Tooltip>
            <Tooltip
                target='#editButton'
                showEvent='mouseenter'
                hideEvent='mouseleave'
            >
                <div className='text-base text-primary-700'>
                    {!isEditing ? 'Edit' : 'Cancel edit'}
                </div>
            </Tooltip>
            <Tooltip
                target='#deleteButton'
                showEvent='mouseenter'
                hideEvent='mouseleave'
            >
                <div className='text-base text-primary-700'>Delete</div>
            </Tooltip>
        </>
    );
};

export default ToolbarTooltips;
