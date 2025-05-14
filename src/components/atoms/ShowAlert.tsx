import Swal, { SweetAlertIcon } from 'sweetalert2';
import { t } from 'i18next';

function showAlert(
    tit?: string,
    text_inpL?: string,
    inp?: boolean,
    confirm_btn_txt?: string,
    show_cancel?: boolean,
    type?: SweetAlertIcon,
    action?: () => void
): Promise<string | null> {
    return new Promise((resolve) => {
        if (!inp) {
            Swal.fire({
                icon: type,
                title: tit,
                text: text_inpL,
                showCancelButton: show_cancel,
                confirmButtonText: confirm_btn_txt || `${t('buttons.confirm')}`,
                cancelButtonText: `${t('buttons.cancel')}`,
                padding: '2em',
                customClass: 'sweet-alerts',
            }).then((result) => {
                if (result.isConfirmed) {
                    resolve(result.value);
                    if (action) {
                        action();
                    }
                } else {
                    resolve(null); // Resolve with null if cancelled
                }
            });
        } else {
            Swal.fire({
                title: tit,
                input: 'text',
                inputLabel: text_inpL,
                confirmButtonText: confirm_btn_txt,
                inputPlaceholder: 'Enter your new event',
            }).then((result) => {
                if (result.isConfirmed) {
                    resolve(result.value);
                } else {
                    resolve(null); // Resolve with null if cancelled
                }
            });
        }
    });
}

export default showAlert;
