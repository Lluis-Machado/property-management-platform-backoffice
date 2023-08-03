'use client';

import { memo, useCallback, useRef, useState } from 'react';
// Libraries imports
import { useRouter } from 'next/navigation';
import { Button } from 'pg-components';
import { toast } from 'react-toastify';
import Form, {
    EmailRule,
    GroupItem,
    Item,
    RequiredRule,
    StringLengthRule,
} from 'devextreme-react/form';

// Local imports
import { ContactData } from '@/lib/types/contactData';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import { dateFormat } from '@/lib/utils/datagrid/customFormats';
import { Locale } from '@/i18n-config';
import { TokenRes } from '@/lib/types/token';
import { formatDate } from '@/lib/utils/formatDateFromJS';
import { customError } from '@/lib/utils/customError';
import { apiPost } from '@/lib/utils/apiPost';
import { CountryData } from '@/lib/types/countriesData';
import useCountryChange from '@/lib/hooks/useCountryChange';

let dataSource = {
    splitDocumentRanges: [
        {
            from: 0,
            to: 0,
        },
    ],
};

const SplitDocumentForm = () => {
    const [ranges, setRanges] = useState([]);

    return (
        <div>
            <Form
                formData={dataSource}
                labelMode={'floating'}
                readOnly={false}
                showValidationSummary
            >
                <GroupItem colCount={1} caption={`List of ranges`}>
                    {dataSource.splitDocumentRanges.map((range, index) => {
                        return (
                            <GroupItem key={`GroupItem${index}`} colCount={3}>
                                <Item
                                    key={`from${index}`}
                                    dataField={`splitDocumentRanges[${index}].from`}
                                    label={{ text: 'From' }}
                                    editorType='dxNumberBox'
                                />
                                <Item
                                    key={`to${index}`}
                                    dataField={`splitDocumentRanges[${index}].to`}
                                    label={{ text: 'To' }}
                                    editorType='dxNumberBox'
                                />

                                <Item
                                    key={`button${index}`}
                                    itemType='button'
                                    horizontalAlignment='left'
                                    buttonOptions={{
                                        icon: 'trash',
                                        text: 'Remove range',
                                        onClick: () => {
                                            if (
                                                dataSource.splitDocumentRanges
                                                    .length > 1
                                            ) {
                                                // Set a new empty address
                                                dataSource.splitDocumentRanges.splice(
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
                            dataSource.splitDocumentRanges.push({
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
                            // disabled={isLoading}
                            // isLoading={isLoading}
                            // onClick={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SplitDocumentForm;
