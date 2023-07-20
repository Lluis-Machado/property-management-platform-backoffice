// Libraries imports
import Image from 'next/image';
import { ToastContainer } from 'react-toastify';

// Local imports
import logoPng from '@/public/WUF_BACKOFFICE.png';

interface Props {
    children: React.ReactNode;
}

const RootLayout = ({ children }: Props): React.ReactElement => (
    <div className='h-screen bg-white'>
        <div className='flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
            <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                <Image
                    src={logoPng}
                    alt='WuF Logo'
                    className='mx-auto h-48 w-auto'
                    priority
                />
            </div>

            <div className='mt-5 sm:mx-auto sm:w-full sm:max-w-sm'>
                {children}
                <p className='mt-6 text-center text-sm text-gray-400'>
                    Copyright &copy; {new Date().getFullYear()}, PlattesGroup.
                    All rights reserved.
                </p>
            </div>
        </div>
        <ToastContainer />
    </div>
);

export default RootLayout;
