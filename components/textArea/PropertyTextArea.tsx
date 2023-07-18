'use client';

// React imports
import { useCallback, useRef, useState } from 'react';

// Libraries imports
import TextArea from 'devextreme-react/text-area';
import { Button } from 'pg-components';
import { toast } from 'react-toastify';

// Local imports
import { Locale } from '@/i18n-config';
import { PropertyData } from '@/lib/types/propertyInfo';
import { TokenRes } from '@/lib/types/token';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import { apiPatch } from '@/lib/utils/apiPatch';
import { customError } from '@/lib/utils/customError';

interface Props {
    propertyData: PropertyData;
    token: TokenRes;
    lang: Locale;
}

const PropertyTextArea = ({ propertyData, token, lang }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const textareaRef = useRef<TextArea>(null);

    const handleSubmit = useCallback(async () => {
        const values = structuredClone(propertyData);
        values.comments = textareaRef.current?.instance.option('value') || '';

        console.log('Valores a enviar: ', values);

        if (values.comments === propertyData.comments) {
            toast.warning('You can not save the same comments as before');
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading('Updating comments...');

        try {
            const data = await apiPatch(
                `/properties/properties/${propertyData.id}`,
                values,
                token,
                'Error while updating a property'
            );

            console.log('TODO CORRECTO, valores de vuelta: ', data);
            updateSuccessToast(toastId, 'Comments updated correctly!');
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [propertyData]);

    return (
        <>
            <TextArea
                ref={textareaRef}
                minHeight={90}
                label='Additional comments'
                defaultValue={propertyData.comments}
                readOnly={isLoading}
                autoResizeEnabled
            />
            <div className='mt-4 flex justify-end'>
                <div className='flex flex-row justify-between gap-2'>
                    <Button
                        elevated
                        type='button'
                        text='Update side notes'
                        isLoading={isLoading}
                        disabled={isLoading}
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </>
    );
};

export default PropertyTextArea;
