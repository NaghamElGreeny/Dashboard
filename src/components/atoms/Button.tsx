import { ReactNode } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { Spinner } from './UI/Spinner';

const bottonVars = tv({
    variants: {
        color: {
            primary: 'bg-bg_banfsgy text-white px-2 rounded ',
        },
    },
    compoundVariants: [
        {
            // color: 'primary',
            // disabled: true,
            className: 'text-white bg_banfsgy',
        },
    ],
    defaultVariants: {
        color: 'primary',
    },
});

type ButtonVariants_TP = VariantProps<typeof bottonVars>;

interface ButtonProps_TP extends ButtonVariants_TP {
    children: ReactNode;
    className?: string;
    disabled?: boolean;
    action?: () => void;
    variant?: 'primary';
    loading?: boolean;
    type?: 'button' | 'submit' | 'reset';
    bordered?: boolean;
}
function Button({
    variant,
    children,
    className,
    disabled,
    action,
    loading,
    type = 'button',
    bordered = false,
    ...props
}: ButtonProps_TP) {
    var newClass = className;
    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={bottonVars({
                color: variant,
                className: newClass,
            })}
            onClick={action}
            {...props}
        >
            {loading ? <Spinner /> : children}
        </button>
    );
}

export default Button;
