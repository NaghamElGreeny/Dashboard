import { useFormikContext } from 'formik';
import { forwardRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { tv } from 'tailwind-variants';
import { BaseInput, FormikError, Label } from '../../atoms';

const dateInputField = tv({
    base: 'direction-rtl',
    variants: {
        active: {
            true: '!rounded-md !border-2 !border-mainGreen !ring-0',
        },
        error: {
            true: '!rounded-md !border-2 ',
            // true: '!rounded-md !border-2 !border-mainRed',
        },
    },
});

const DatePickerInput = forwardRef(({ ...props }, ref?: any) => {
    return <BaseInput ref={ref} {...props} />;
});

export const DateInputField = ({
    label,
    name,
    maxDate,
    minDate,
    labelProps,
    value,
}: {
    label: string;
    name: string;
    maxDate?: Date;
    minDate?: Date;
    labelProps?: {
        [key: string]: any;
    };
    value: string;
}) => {
    const { setFieldValue, errors, touched, handleBlur, values } = useFormikContext<{
        [key: string]: any;
    }>();
    const [dateActive, setDateActive] = useState(false);

    // Function to handle date conversion if necessary
    const handleDateChange = (date: Date | null) => {
        if (date) {
            const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            setFieldValue(name, utcDate);
        } else {
            setFieldValue(name, null);
        }
    };

    return (
        <div className="col-span-1">
            <div className="flex flex-col gap-1">
                <Label
                    htmlFor={name}
                    //@ts-ignore
                    {...labelProps}
                    className="mb-3"
                >
                    {label}
                </Label>
                <DatePicker
                    selected={values[name] ? new Date(values[name]) : null}
                    onChange={handleDateChange}
                    onBlur={handleBlur(name)}
                    className={dateInputField({
                        active: dateActive,
                        error: touched[name] && !!errors[name],
                    })}
                    onCalendarOpen={() => setDateActive(true)}
                    onCalendarClose={() => setDateActive(false)}
                    maxDate={maxDate}
                    dateFormat="yyyy-MM-dd"
                    minDate={minDate}
                    customInput={<DatePickerInput />}
                    isClearable={true}
                    name={name}
                />
            </div>
            <FormikError name={name} />
        </div>
    );
};
