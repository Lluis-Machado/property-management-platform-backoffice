'use client';

import Link from 'next/link';

const error = ({ error }: { error: Error }) => {
    return (
        <main className='grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8'>
            <div className='text-center'>
                <p className='text-base font-semibold text-primary-700'>
                    There was a problem
                </p>
                <h1 className='mt-4 text-3xl font-bold tracking-tight text-zinc-900'>
                    {error.message || 'Something went wrong'}
                </h1>
                <p className='mt-6 text-base leading-7 text-zinc-600'>
                    Please try again later or contact support if the problem
                    persists.
                </p>
                <div className='mt-10 flex items-center justify-center gap-x-6'>
                    <Link
                        href={'/'}
                        className='rounded-md bg-primary-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-600 focus:bg-primary-600 focus:outline-none focus:ring focus:ring-primary-400 focus:ring-opacity-50'
                    >
                        Go back home
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default error;
