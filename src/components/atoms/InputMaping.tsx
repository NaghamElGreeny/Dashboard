//@ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik';

type InputMapingProps = {
    label?: string;
    placeholder?: string;
    description?: string;
    error?: string;
    className?: string;
    type?: string;
    handleChange?: any;
    value?: any;
    name?: string;
};

const InputMaping = React.forwardRef<HTMLInputElement, InputMapingProps>(
    (
        {
            label,
            placeholder,
            description,
            error,
            className,
            value,
            name,
            type,
            handleChange,
            ...props
        },
        ref
    ) => {
        const { values, setFieldValue } = useFormikContext<any>(); // استخدام أي لأن النوع الدقيق للقيم غير معروف

        return (
            <input
                id={name}
                {...props}
                name={name}
                value={values[name]}
                type={type || 'text'} // توفير قيمة افتراضية للنوع
                placeholder={placeholder}
                ref={ref} // تمرير ref هنا
                onChange={(e) => {
                    // الدالة handleChange مُعرّفة لكن لم تُستخدم، ربما تود استخدامها هنا بدلاً من setFieldValue مباشرة
                    if (handleChange) {
                        handleChange(e);
                    } else if (props.value === undefined) {
                        setFieldValue(name, e.target.value);
                    }
                }}
                className={`form-input ${className || ''}`} // توفير قيمة افتراضية لـ className
            />
        );
    }
);

export default InputMaping;
