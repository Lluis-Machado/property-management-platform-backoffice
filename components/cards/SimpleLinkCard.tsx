import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { memo } from 'react';

interface Props {
    href: string;
    text: string;
    faIcon: IconDefinition;
}

const SimpleLinkCard = ({ href, text, faIcon }: Props) => {
    return (
        <Link
            href={href}
            className='flex items-center gap-2 rounded-md border-2 p-2 transition-all hover:border-primary-500 hover:shadow-md'
        >
            <FontAwesomeIcon icon={faIcon} className='text-primary-500' />
            <p className='text-zinc-700'>{text}</p>
        </Link>
    );
};

export default memo(SimpleLinkCard);
