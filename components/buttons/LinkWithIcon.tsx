import { memo } from 'react';

// Libraries imports
import Link from 'next/link';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
    href: string;
    icon: IconProp;
}

const LinkWithIcon = ({ href, icon }: Props): React.ReactElement => (
    <Link href={href}>
        <FontAwesomeIcon
            icon={icon}
            className='row-focused-state text-primary-500 transition-transform hover:scale-125'
        />
    </Link>
);

export default memo(LinkWithIcon);
