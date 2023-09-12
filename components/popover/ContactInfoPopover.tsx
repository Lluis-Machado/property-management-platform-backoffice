import { memo } from 'react';
import { ContactData } from '@/lib/types/contactData';
import Popover from 'devextreme-react/popover';
import { Button } from 'pg-components';

interface Props {
    popoverTarget: string;
    isPopoverVisible: boolean;
    selectedContactInfo: ContactData;
    onHidden: () => void;
}

const ContactInfoPopover = ({
    popoverTarget,
    isPopoverVisible,
    selectedContactInfo,
    onHidden,
}: Props) => {
    return (
        <Popover
            target={'#' + popoverTarget}
            visible={isPopoverVisible}
            onHidden={onHidden}
            position='top'
            width={'auto'}
        >
            <div className='mb-2'>
                Email:{' '}
                {!selectedContactInfo?.email ? (
                    'No email found'
                ) : (
                    <ul className='ml-8 list-disc'>
                        <li>
                            <a
                                href={`mailto:${selectedContactInfo?.email}`}
                                className='text-blue-500'
                            >
                                {selectedContactInfo?.email}
                            </a>
                        </li>
                    </ul>
                )}
            </div>
            <div className='mb-2'>
                Phones:{' '}
                {selectedContactInfo?.phones.length === 0 ? (
                    'No phones found'
                ) : (
                    <ul className='ml-8 list-disc'>
                        {selectedContactInfo?.phones.map((phone, index) => (
                            <li key={`phones-${index}`}>
                                <a
                                    href={`tel:${phone.phoneNumber}`}
                                    className='text-blue-500'
                                >
                                    {phone.phoneNumber}
                                </a>
                                <br />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <Button
                text='View full details'
                onClick={() =>
                    window.open(
                        `${location.origin}/private/contacts/${selectedContactInfo?.id}/contactInfo`,
                        '_blank'
                    )
                }
            />
        </Popover>
    );
};

export default memo(ContactInfoPopover);
