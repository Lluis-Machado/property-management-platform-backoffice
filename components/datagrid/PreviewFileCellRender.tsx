// Libraries imports
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';

interface Props {
    onClick: () => void;
    url: string | null | false;
}

const PreviewFileCellRender = ({ onClick, url }: Props): React.ReactElement => {
    const validUrl = url && url.trim() !== '';

    const classnames = validUrl
        ? 'text-primary-500 row-focused-state cursor-pointer'
        : 'text-primary-100';

    const iconDesc = validUrl ? 'Preview file' : 'No file available';

    const onClickHandler = (event: React.MouseEvent<HTMLElement>) => {
        if (validUrl) {
            onClick();
        } else {
            import('./FileNotAvailableAlert').then((module) =>
                module.fileNotAvailable()
            );
            alert('No file available');
        }
        event.stopPropagation();
    };

    return (
        <div className='flex select-none justify-start md:justify-center'>
            <motion.span
                title={iconDesc}
                onClick={onClickHandler}
                whileHover={
                    validUrl ? { scale: 1.25 } : { rotateZ: [0, 45, -45, 0] }
                }
                transition={validUrl ? { type: 'spring' } : undefined}
                className={classnames}
            >
                <FontAwesomeIcon icon={faFile} />
            </motion.span>
        </div>
    );
};

export default PreviewFileCellRender;
