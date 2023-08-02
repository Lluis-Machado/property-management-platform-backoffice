import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { memo } from 'react';

const AddRowButton = ({ href }: { href: string }) => {
    return (
        <Link
            href={href}
            className='flex cursor-pointer flex-row items-center rounded-md border border-slate-300 p-2.5 text-gray-500
            hover:border-primary-200 hover:text-primary-500 active:border-primary-500 active:text-primary-700'
        >
            <FontAwesomeIcon icon={faPlus} />
        </Link>
    );
};

export default memo(AddRowButton);
