import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link'
import React from 'react'

interface Props {
    href: string;
    text: string;
    faIcon: IconDefinition;
}

const SimpleLinkCard = ({ href, text, faIcon }: Props) => {
    return (
        <Link
            href={{ href }}
            className="flex gap-2 items-center border-2 rounded-md p-2 hover:shadow-md hover:border-primary-500 transition-all"
        >
            <FontAwesomeIcon
                icon={faIcon}
                className='text-primary-500'
            />
            <p className="text-zinc-700">
                {text}
            </p>
        </Link>
    )
}

export default SimpleLinkCard