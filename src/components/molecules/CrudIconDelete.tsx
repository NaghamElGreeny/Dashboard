import penEdit from '/assets/images/Pen 2.png';
import deleteIcon from '/assets/images/Trash Bin Trash.png';

type CrudIconDelete_TP = {
    deleteAction?: () => void;
};

function CrudIconDelete({ deleteAction }: CrudIconDelete_TP) {
    return (
        <div className="flex items-center ">
            <img src={deleteIcon} className="cursor-pointer" onClick={deleteAction} />
        </div>
    );
}

export default CrudIconDelete;
