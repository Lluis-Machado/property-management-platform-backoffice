export const fileNotAvailable = async () => {
    const { default: notify } = await import('devextreme/ui/notify');
    notify(
        {
            message: 'File not available',
            width: '40vw',
            position: {
                my: 'bottom center',
                at: 'bottom center',
                offset: '0 -20',
                of: '#content',
            },
        },
        'warning',
        4000
    );
};
