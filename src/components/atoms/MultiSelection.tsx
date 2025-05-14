import { useFormikContext } from 'formik';
import { type } from 'os';
import React, { FC } from 'react';
import Select from 'react-select';
type SelectCustom_TP = {
    label?: string;
    placeholder?: string;
    description?: string;
    error?: string;
    className?: string;
    type?: string;
    handleChange?: any;
    value?: any;
    name?: any;
    options?: any;
};
const MultiSelection = ({ label, placeholder, description, error, className, value, name, type, options, handleChange, ...props }: SelectCustom_TP) => {
    const { values, setFieldValue } = useFormikContext<any>(); /////////// STATES

    const optionVal = options?.map((item: any) => ({
        value: item?.id,
        label: item?.role_name,
    }));

    return (
        <Select
            id={name}
            {...props}
            name={name}
            isMulti={true}
            options={optionVal}
            onChange={(event) => {
                //@ts-ignore
                setFieldValue(name, event?.value);
            }}
            required
        />
    );
};

export default MultiSelection;
