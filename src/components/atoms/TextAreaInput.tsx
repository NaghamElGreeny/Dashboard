export interface TextAreaInputProp_TP extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
    override?: boolean;
    autocomplete?: string;
}

const BASE_CLASS_NAME =
    'form-textarea w-full rounded-md  px-4 py-[.30rem] outline-none focus:!border-[1px] focus:!border-mainGreen dark:focus:!border-[#17263c] dark:focus-visible:!border-[#17263c] shadows';

export const TextAreaInput = ({
    name,
    id,
    className,
    disabled,
    override,
    autocomplete,
    ...props
}: TextAreaInputProp_TP) => {
    var newClassName = `${BASE_CLASS_NAME} ${className || ''}`;
    if (override) {
        newClassName = className || '';
    }
    return (
        <textarea
            name={name}
            id={id}
            disabled={disabled}
            className={`${newClassName} `}
            autoComplete={autocomplete}
            {...props}
        />
    );
};
