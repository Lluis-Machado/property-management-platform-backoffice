const NotFound = (): React.ReactElement => (
  <main className='grid h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8 font-barlow'>
    <div className='text-center'>
      <p className='text-base font-semibold text-primary-500'>404</p>
      <h1 className='mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl'>Page not found</h1>
      <p className='mt-6 text-base leading-7 text-gray-600'>Sorry, we couldn’t find the page you’re looking for.</p>
      <div className='mt-10 flex items-center justify-center gap-x-6'>
        <a
          href='/'
          className='rounded-md bg-primary-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:bg-primary-600 focus:ring focus:ring-primary-400 focus:ring-opacity-50'
        >
          Go back home
        </a>
        <a href="mailto:support@plattesgroup.net?subject=Couldn't%20find%20requested%20page" className='text-sm font-semibold text-gray-900'>
          Contact support <span aria-hidden='true'>&rarr;</span>
        </a>
      </div>
    </div>
  </main>
);

export default NotFound;