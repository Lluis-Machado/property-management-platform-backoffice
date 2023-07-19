import { faPencil, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch, SetStateAction } from 'react';

interface Props {
    isEditing: boolean;
    setIsEditing: Dispatch<SetStateAction<boolean>>;
}

const EditButton = ({ isEditing, setIsEditing }: Props) => {
    return (
        <button
            className='flex cursor-pointer items-center rounded-md border-2 p-2 transition-all hover:border-primary-500 hover:shadow-md'
            onClick={() => setIsEditing((prev) => !prev)}
        >
            <FontAwesomeIcon
                icon={isEditing ? faXmark : faPencil}
                className='text-primary-500'
            />
        </button>
    );
};

export default EditButton;
