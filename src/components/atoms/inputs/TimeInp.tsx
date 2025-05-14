import { ActionIcon, rem } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { IconClock } from '@tabler/icons-react';
import { useFormikContext } from 'formik';
import React, { useRef } from 'react';

type time = {
    label: string;
    name?: string;
    defaultValue?: string;
    onChange?: () => void;
    otherProps?: any;
};

function TimeInp({ label, name, defaultValue, onChange, ...props }: any) {
    const ref = useRef<HTMLInputElement>(null);

    const { setFieldValue, setFieldTouched, errors, touched, values } = useFormikContext<{
        [key: string]: any;
    }>();

    const handleOnChange = (e: any) => {
        setFieldValue(name, e.target.value);
    };

    const pickerControl = (
        <ActionIcon variant="subtle" color="gray" onClick={() => ref.current?.showPicker()}>
            <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
        </ActionIcon>
    );

    return (
        <>
            <TimeInput
                ref={ref}
                name={name}
                label={label}
                defaultValue={defaultValue}
                rightSection={pickerControl}
                onChange={handleOnChange}
                onBlur={() => {
                    setFieldTouched(name, true);
                }}
                {...props}
            />
            {touched[name] && errors[name] && typeof errors[name] === 'string' && (
                <div className="text-red-500 text-sm ">{errors[name] as string}</div>
            )}
        </>
    );
}

export default TimeInp;
