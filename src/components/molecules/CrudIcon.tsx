import { FaRegEdit } from 'react-icons/fa';
import penEdit from '/assets/images/Pen 2.png';
import deleteIcon from '/assets/images/Trash Bin Trash.png';

type CrudIcon_TP = {
    editAction?: () => void;
    deleteAction?: () => void;
    hideEdit?: boolean;
    hideDelete?: boolean;
};

function CrudIcon({ editAction, deleteAction, hideEdit, hideDelete }: CrudIcon_TP) {
    return (
        <div className="flex items-center ">
            {!hideEdit && (
                <FaRegEdit
                    className="cursor-pointer text-[19px] text-warning"
                    onClick={editAction}
                />
            )}
            {!hideDelete && (
                <img src={deleteIcon} className="cursor-pointer" onClick={deleteAction} />
            )}
        </div>
    );
}

export default CrudIcon;
