import penEdit from '/assets/images/Pen 2.png';
import deleteIcon from '/assets/images/Trash Bin Trash.png';

type CrudIconEditOnly_TP = {
    editAction?: () => void;
};

function CrudIconEditOnly({ editAction }: CrudIconEditOnly_TP) {
    return (
        <div className="flex items-center ">
            <img src={penEdit} className="cursor-pointer" onClick={editAction} />
        </div>
    );
}

export default CrudIconEditOnly;
