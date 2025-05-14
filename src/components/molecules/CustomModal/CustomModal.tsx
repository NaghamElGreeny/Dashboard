import { useEffect } from 'react';
import classes from './CustomModal.module.css';
import { useTranslation } from 'react-i18next';

const Modal = ({ opened, setOpen, title, children }: any) => {
    const { t } = useTranslation();
    useEffect(() => {
        // Toggle the body's overflow style based on the modal's open state
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = opened ? 'hidden' : originalStyle;

        // Cleanup function to reset the overflow style
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, [opened]);

    if (!opened) return null;

    const stopPropagation = (e: any) => {
        e.stopPropagation();
    };

    return (
        <div className={classes['modal-backdrop']} onClick={() => setOpen?.(!opened)}>
            <div className={classes['modal-content']} onClick={stopPropagation}>
                <div className="w-full flex justify-between pe-6">
                    <p className="text-[20px] font-bold">{title}</p>
                    <button onClick={() => setOpen?.(!opened)} className={classes['close-button']}>
                        X
                    </button>
                </div>
                <div className={classes['modal-content-body']}>{children}</div>
            </div>
        </div>
    );
};

export default Modal;
