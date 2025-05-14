import Swal from 'sweetalert2';

type AlertType = 'success' | 'error' | 'warning' | 'info' | 'question';

interface ShowAlertMixinProps {
    type: number;
    icon?: AlertType;
    title?: string;
    text?: string;
    position?: 'top-end' | 'top-start' | 'bottom-end' | 'bottom-start';
    duration?: number;
}

const ShowAlertMixin = async ({
    type,
    icon = 'success',
    title,
    text,
    position = 'top-end',
    duration = 3000,
}: ShowAlertMixinProps) => {
    if (type === 15) {
        const toast = Swal.mixin({
            toast: true,
            position,
            showConfirmButton: false,
            timer: duration,
        });

        toast.fire({
            icon: icon,
            title: title || 'Operation completed',
            text: text || '',
            padding: '10px 20px',
        });
    }
};

export default ShowAlertMixin;
