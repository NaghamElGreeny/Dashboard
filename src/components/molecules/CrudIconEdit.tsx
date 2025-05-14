import iconShow from '/assets/images/hide.png';
import deleteIcon from '/assets/images/Trash Bin Trash.png';

type CrudIconEdit_TP = {
    editAction?: () => void;
    deleteAction?: () => void;
    hideEdit?: boolean;
    hideDelete?: boolean;
    editSuccess?: boolean;
};

function CrudIconEdit({
    editAction,
    deleteAction,
    hideEdit,
    hideDelete,
    editSuccess,
}: CrudIconEdit_TP) {
    return (
        <div className="flex items-center ">
            {hideEdit && (
                <img
                    src={iconShow}
                    className={`cursor-pointer ${editSuccess && 'icon-show-success'}`}
                    onClick={editAction}
                />
            )}

            {!hideDelete && (
                <img src={deleteIcon} className="cursor-pointer" onClick={deleteAction} />
            )}
        </div>
    );
}

export default CrudIconEdit;
