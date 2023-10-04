'use client';

import { memo, useCallback, useRef, useState } from 'react';
// Libraries imports
import { useRouter } from 'next/navigation';
import { Button } from 'pg-components';
import { toast } from 'react-toastify';
import Form, { GroupItem, Item, RequiredRule } from 'devextreme-react/form';

// Local imports
import { updateSuccessToast } from '@/lib/utils/customToasts';
import { Locale } from '@/i18n-config';
import { customError } from '@/lib/utils/customError';
import { RangesData } from '@/lib/types/rangesData';

interface Props {
    rangesData: RangesData;
    lang: Locale;
}

const SplitDocumentForm = ({ rangesData, lang }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // Importante para que no se copie por referencia
    const [initialValues, setInitialValues] = useState<RangesData>(
        structuredClone(rangesData)
    );
    const [ranges, setRanges] = useState([]);

    const formRef = useRef<Form>(null);
    const router = useRouter();

    const handleSubmit = useCallback(async () => {
        const res = formRef.current!.instance.validate();
        if (!res.isValid) return;

        const values = structuredClone(rangesData);

        if (JSON.stringify(values) === JSON.stringify(initialValues)) {
            toast.warning('Change at least one field');
            return;
        }

        setIsLoading(true);

        const toastId = toast.loading('Creating contact...');

        try {
            const valuesToSend: string = values.splitDocumentRanges
                .map((range) => `${range.from}-${range.to}`)
                .join(',');

            console.log('Valores a enviar: ', valuesToSend);
            console.log(
                'Valores a enviar en JSON: ',
                JSON.stringify(valuesToSend)
            );

            throw new Error('API call not implemented');

            // const data = await apiPost(
            //     '/contacts/contacts',
            //     valuesToSend,
            //     token,
            //     'Error while creating a contact'
            // );

            // console.log('TODO CORRECTO, valores de vuelta: ', data);

            updateSuccessToast(toastId, 'Contact created correctly!');
            router.push('/private/contacts');
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [rangesData, initialValues, router]);

    return (
        <div>
            <Form
                ref={formRef}
                formData={rangesData}
                labelMode={'floating'}
                readOnly={false}
                showValidationSummary
            >
                <GroupItem colCount={1} caption={`List of ranges`}>
                    {rangesData.splitDocumentRanges.map((range, index) => {
                        return (
                            <GroupItem key={`GroupItem${index}`} colCount={3}>
                                <Item
                                    key={`from${index}`}
                                    dataField={`splitDocumentRanges[${index}].from`}
                                    label={{ text: 'From' }}
                                    editorType='dxNumberBox'
                                >
                                    <RequiredRule />
                                </Item>
                                <Item
                                    key={`to${index}`}
                                    dataField={`splitDocumentRanges[${index}].to`}
                                    label={{ text: 'To' }}
                                    editorType='dxNumberBox'
                                >
                                    <RequiredRule />
                                </Item>

                                <Item
                                    key={`button${index}`}
                                    itemType='button'
                                    horizontalAlignment='left'
                                    buttonOptions={{
                                        icon: 'trash',
                                        text: 'Remove range',
                                        onClick: () => {
                                            if (
                                                rangesData.splitDocumentRanges
                                                    .length > 1
                                            ) {
                                                // Set a new empty address
                                                rangesData.splitDocumentRanges.splice(
                                                    index,
                                                    1
                                                );
                                                // Update address fields
                                                setRanges([]);
                                            } else {
                                                toast.error(
                                                    'You need at least one range'
                                                );
                                            }
                                        },
                                    }}
                                />
                            </GroupItem>
                        );
                    })}
                </GroupItem>
                <Item
                    itemType='button'
                    horizontalAlignment='left'
                    buttonOptions={{
                        icon: 'add',
                        text: 'Add range',
                        onClick: () => {
                            // Set a new empty address
                            rangesData.splitDocumentRanges.push({
                                from: 0,
                                to: 0,
                            });
                            // Update address fields
                            setRanges([]);
                        },
                    }}
                />
            </Form>
            <div className='h-[2rem]'>
                <div className='flex justify-end'>
                    <div className='flex flex-row justify-between gap-2'>
                        <Button
                            elevated
                            type='button'
                            text='Submit Changes'
                            disabled={isLoading}
                            isLoading={isLoading}
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(SplitDocumentForm);
