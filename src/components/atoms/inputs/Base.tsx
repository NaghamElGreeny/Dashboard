import { ErrorMessage, FastField } from 'formik';
import { forwardRef } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const GeneralInputClass: string = 'form-input px-4 py-[.70rem] w-full shadows';

const baseInput = tv({
    base: 'rounded-md border-[1px] focus:!border-[1px] focus:!border-mainGreen dark:focus:!border-[#17263c] dark:focus-visible:!border-[#17263c]',
    variants: {
        error: {
            true: 'border-mainRed',
        },
        type: {
            checkbox:
                'w-4 h-4 text-mainGreen border-gray-300 rounded focus:ring-mainGreen form-checkbox shadow-none',
            radio: 'w-5 h-5 form-radio rounded-full focus:ring-mainGreen border-gray-300',
            text: GeneralInputClass,
            email: GeneralInputClass,
            password: GeneralInputClass,
            number: GeneralInputClass,
            date: GeneralInputClass,
            time: GeneralInputClass,
            datetime: GeneralInputClass,
            month: GeneralInputClass,
            week: GeneralInputClass,
            tel: GeneralInputClass,
            url: GeneralInputClass,
            search: GeneralInputClass,
            color: GeneralInputClass,
        },
    },
});

type BaseInputVariants_TP = VariantProps<typeof baseInput>;

export interface BaseInputProps_TP extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    autocomplete?: string;
    error?: boolean;
    ref?: any;
}

export const BaseInput = forwardRef(
    ({ error, ...props }: BaseInputProps_TP & BaseInputVariants_TP, ref: any) => {
        return (
            <FastField name={props.name}>
                {({ field, form }: any) => {
                    const isError = form.touched[field.name] && form.errors[field.name];
                    return (
                        <div>
                            <input
                                {...field}
                                {...props}
                                type={props.type || 'text'}
                                id={props.id}
                                className={baseInput({
                                    error: isError,
                                    className: props.className,
                                    type: props.type || 'text',
                                })}
                                autoComplete={props.autoComplete}
                                value={props.value}
                                ref={ref}
                            />
                        </div>
                    );
                }}
            </FastField>
        );
    }
);
