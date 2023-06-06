// React imports
import { useId } from 'react';

interface Props {
    /**
     * Position of the tooltip
     */
    position?: positionType;
    /**
     * Size of the tooltip
     */
    size?: sizeType;
    /**
     * Content of the tooltip
     */
    text: string;
}

type positionType = 'top' | 'right' | 'bottom' | 'left';
type sizeType = 'normal' | 'small';

const getPosition = (position: positionType, size: sizeType): string => {
    const positions = {
        top: `bottom-full   left-1/2    mb-2 -translate-x-1/2 before:left-1/2   before:top-full     before:mb-2 ${size == 'normal' ? 'before:-ml-2 before:border-x-8 before:border-t-8' : 'before:-ml-1 before:border-x-4 before:border-t-4'} before:border-x-transparent before:border-t-slate-700`,
        right: `left-full   top-1/2     ml-2 -translate-y-1/2 before:top-1/2    before:right-full   before:ml-2 ${size == 'normal' ? 'before:-mt-2 before:border-y-8 before:border-r-8' : 'before:-mt-1 before:border-y-4 before:border-r-4'} before:border-y-transparent before:border-r-slate-700`,
        bottom: `top-full   left-1/2    mt-2 -translate-x-1/2 before:left-1/2   before:bottom-full  before:mt-2 ${size == 'normal' ? 'before:-ml-2 before:border-x-8 before:border-b-8' : 'before:-ml-1 before:border-x-4 before:border-b-4'} before:border-x-transparent before:border-b-slate-700`,
        left: `right-full   top-1/2     mr-2 -translate-y-1/2 before:top-1/2    before:left-full    before:mr-2 ${size == 'normal' ? 'before:-mt-2 before:border-y-8 before:border-l-8' : 'before:-mt-1 before:border-y-4 before:border-l-4'} before:border-y-transparent before:border-l-slate-700`,
    }

    return positions[position];
}

const getSize = (size: sizeType): string => {
    const sizes = {
        normal: 'p-4 text-sm',
        small: 'p-2 text-xs',
    }

    return sizes[size];
}

export const Tooltip = ({ position = 'top', size = 'normal', text }: Props): JSX.Element => {
    const id = useId();
    return (
        <span
            className='relative overflow-hidden cursor-pointer group hover:overflow-visible focus-visible:outline-none'
            aria-describedby={id}
        >
            Lorem ipsum
            <span
                role='tooltip'
                id={id}
                className={`
                    invisible absolute z-10 w-48 rounded bg-slate-700 text-white opacity-0 transition-all before:invisible 
                    before:absolute before:z-10 before:opacity-0 before:transition-all before:content-[''] group-hover:visible 
                    group-hover:block group-hover:opacity-100 group-hover:before:visible group-hover:before:opacity-100 
                    ${getPosition(position, size)}
                    ${getSize(size)}
                `}
            >
                {text}
            </span>
        </span>
    )
}

export default Tooltip;