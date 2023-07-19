// Libraries imports
import {
    faChevronRight,
    faDatabase,
    faMagnifyingGlass,
    faSliders,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tabs } from 'pg-components';

// Local imports
import { FileActions } from './FileActions';
import { FileMetaData } from './FileMetaData';

interface Props {
    className: string;
    onFileDetailsClosed: () => void;
    selectedFile: any;
}

export const DetailsWrapper = ({
    className,
    onFileDetailsClosed,
    selectedFile,
}: Props) => (
    <div className={`flex h-full flex-col ${className} relative`}>
        <Tabs
            size='large'
            dataSource={[
                {
                    icon: faMagnifyingGlass,
                    title: 'Preview',
                    children: (
                        <iframe
                            className='h-full w-full'
                            src='https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
                        />
                    ),
                },
                {
                    icon: faSliders,
                    title: 'Actions',
                    children: <FileActions />,
                },
                {
                    icon: faDatabase,
                    title: 'Metadata',
                    children: <FileMetaData />,
                },
            ]}
        />
        <div
            className='absolute left-0 top-1/2 flex h-10 w-7 cursor-pointer items-center justify-center border-y border-r border-primary-600 bg-primary-500 text-custom-white'
            onClick={onFileDetailsClosed}
        >
            <FontAwesomeIcon icon={faChevronRight} />
        </div>
        <div
            className='absolute right-0 top-0 flex h-12 w-12 items-center justify-center'
            onClick={onFileDetailsClosed}
        >
            <div className='flex h-3/4 w-3/4 cursor-pointer items-center justify-center rounded-md text-secondary-500 transition-colors hover:bg-secondary-200/20 hover:text-primary-600'>
                <FontAwesomeIcon icon={faXmark} className='' />
            </div>
        </div>
    </div>
);
