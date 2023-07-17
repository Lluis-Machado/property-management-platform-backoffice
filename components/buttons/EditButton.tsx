import { faPencil, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dispatch, SetStateAction } from 'react';

interface Props {
    isEditing: boolean;
    setIsEditing: Dispatch<SetStateAction<boolean>>;
}

const EditButton = ({ isEditing, setIsEditing }: Props) => {
    return (
        <button
            className="flex items-center border-2 rounded-md p-2 cursor-pointer hover:shadow-md hover:border-primary-500 transition-all"
            onClick={() => setIsEditing(prev => !prev)}
        >
            <FontAwesomeIcon
                icon={isEditing ? faXmark : faPencil}
                className='text-primary-500'
            />
        </button>
    )
}

export default EditButton;