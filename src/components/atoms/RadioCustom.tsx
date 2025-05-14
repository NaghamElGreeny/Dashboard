import { Field, useFormikContext } from 'formik';
import { type } from 'os';
import React, { FC } from 'react';

type RadioCustom_TP = {
    label?: string;
    placeholder?: string;
    description?: string;
    error?: string;
    className?: string;
    type?: string;
    handleChange?: any;
    value?: any;
    name?: any;
    publish?: any;
};
const RadioCustom = ({
    label,
    publish,
    placeholder,
    description,
    error,
    className,
    value,
    name,
    type,
    handleChange,
    ...props
}: RadioCustom_TP) => {
    const { values, setFieldValue } = useFormikContext<any>(); /////////// STATES

    return (
        <div role="group" className="flex flex-row items-center" aria-labelledby="my-radio-group">
            <label className="mr-5">
                <Field
                    type="radio"
                    name={name}
                    value={publish[0].value}
                    className="form-radio checked:bg-sky-500"
                    checked
                />
                Publish
            </label>
            <label>
                <Field
                    type="radio"
                    name={name}
                    value={publish[1].value}
                    className="form-radio checked:bg-sky-500"
                />
                Draft
            </label>
        </div>
    );
};

export default RadioCustom;
