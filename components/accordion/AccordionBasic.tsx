interface AccordionItemProps {
    title: string;
    content: string;
}

function AccordionItem({ title, content }: AccordionItemProps) {
    return (
        <details className='group p-4'>
            <summary className='relative cursor-pointer list-none pr-8 font-medium text-slate-700 transition-colors duration-300 focus-visible:outline-none group-hover:text-slate-900  [&::-webkit-details-marker]:hidden'>
                {title}
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='absolute right-0 top-1 h-4 w-4 shrink-0 stroke-slate-700 transition duration-300 group-open:rotate-45'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    aria-labelledby={`title-${title} desc-${title}`}
                >
                    <title>Open icon</title>
                    <desc>icon that represents the state of the summary</desc>
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M12 4v16m8-8H4'
                    />
                </svg>
            </summary>
            <span className='mt-4 text-slate-500'>{content}</span>
        </details>
    );
}

interface AccordionBasicProps {
    items: AccordionItemProps[];
}

export function AccordionBasic({ items }: AccordionBasicProps) {
    return (
        <section className='w-full divide-y divide-slate-200 rounded'>
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.title}
                    content={item.content}
                />
            ))}
        </section>
    );
}
