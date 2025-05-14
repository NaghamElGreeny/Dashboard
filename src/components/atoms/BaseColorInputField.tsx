import React from 'react';
import { ColorInput } from '@mantine/core';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

export default function BaseColorInputField({
    label,
    id,
    placeholder,
    name,
    required,
    ...props
}: {
    label?: string;
    id?: string;
    placeholder?: string;
    name?: any;
    required?: boolean;
}) {
    const { t } = useTranslation();
    const { values, errors, touched, setFieldTouched, setFieldValue } = useFormikContext<any>();

    return (
        <div className="flex flex-col gap-1">
            {/* ColorInput with error handling */}
            <ColorInput
                name={name}
                value={values.hex}
                onChange={(color) => setFieldValue(name, color)}
                label={label}
                placeholder={placeholder || t('enter') + ' ' + t('labels.color')}
                onBlur={() => setFieldTouched(name, true)}
                // error={touched.hex && errors.hex} // Mantine will apply error styles automatically

                // styles={{
                //     input: {
                //         borderColor: touched.hex && errors.hex ? '#f44336' : undefined, // Change border color on error
                //     },
                // }}
                {...props}
            />

            {/* Display the error message if there's a validation error */}
            {touched.hex && errors.hex && typeof errors.hex === 'string' && (
                <div className="text-red-500 text-sm mt-1">{errors.hex}</div>
            )}
        </div>
    );
}
