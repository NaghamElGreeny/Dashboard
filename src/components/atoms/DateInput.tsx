import 'flatpickr/dist/flatpickr.css';
import { useFormikContext } from 'formik';
import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { Label } from './Label';

type DateInputCustom_TP = {
    label?: string;
    placeholder?: string;
    description?: string;
    error?: string;
    className?: string;
    type?: string;
    handleChange?: any;
    value?: any;
    name?: any;
    defaultValue?: any;
    disabled?: any;
    required?: any;
    minDateValue?: any;
};
const DateInput = ({
    label,
    placeholder,
    description,
    className,
    value,
    name,
    type,
    handleChange,
    defaultValue,
    disabled,
    minDateValue,
    required,
    ...props
}: DateInputCustom_TP) => {
    const { values, setFieldValue, errors, touched } = useFormikContext<any>();

    const [flatpickrOptions, setFlatpickrOptions] = useState({
        dateFormat: 'Y-m-d',
        minDate: minDateValue,
    });

    useEffect(() => {
        // Update Flatpickr options dynamically if minDateValue changes
        setFlatpickrOptions((prevOptions) => ({
            ...prevOptions,
            minDate: minDateValue,
        }));
    }, [minDateValue]);

    const handleDateChange = (selectedDates: Date[]) => {
        if (selectedDates.length > 0) {
            const formattedDate = moment(selectedDates[0]).format('YYYY-MM-DD');
            setFieldValue(name, formattedDate);
        }
    };

    // useEffect(() => {
    //     if (values['start_date'] && !values['end_date']) {
    //         document.getElementById('end_date')?.click();
    //     }
    // }, [values]);

    const isError = touched[name] && errors[name];

    return (
        <div className="col-span-1">
            <Label htmlFor="" required={required} className="mb-2">
                {label}
            </Label>
            <Flatpickr
                id={name}
                name={name}
                defaultValue={defaultValue}
                value={value || values[name] || defaultValue}
                options={{ dateFormat: 'Y-m-d', minDate: minDateValue }}
                className="form-input h-[44px]"
                // className={`form-input h-[44px] ${isError ? 'border-red-500' : ''}`}
                placeholder={placeholder}
                onChange={handleDateChange}
                // onChange={(date) => {
                //     setFieldValue(name, moment(date[0]).format('YYYY-MM-DD'));
                // }}

                onOpen={() => {
                    // Ensure today's date is clickable
                    if (minDateValue) {
                        const today = new Date();
                        if (today.toDateString() === new Date(minDateValue).toDateString()) {
                            setFieldValue(name, moment(today).format('YYYY-MM-DD'));
                        }
                    }
                }}
                disabled={disabled}
                required={required}
                {...props}
            />
            {isError && <div className="text-red-500 text-sm mt-1">{errors[name] as string}</div>}
        </div>
    );
};

export default DateInput;
