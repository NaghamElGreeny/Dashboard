//@ts-nocheck

import { useFormikContext } from 'formik';
import { FormikError } from './FormikError';
import { Label } from './Label';
import { TextAreaField } from './TextAreaField';
import { BaseInput } from './inputs/Base';
import UploadImg from './UploadImg';
import { useTranslation } from 'react-i18next';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';

export const BaseInputField = ({
    label,
    id,
    required,
    labelProps,
    placeholder,
    type = 'text',
    // formatNumbers = 0,
    formatNumbers = false,
    disabled = false,
    ...props
}: {
    label?: any;
    id: any;
    required?: boolean;
    labelProps?: {
        [key: string]: any;
    };
    name: any;
    formatNumbers?: boolean;
    disabled?: boolean;
    type: 'text' | 'number' | 'password' | 'email' | 'file' | 'textarea' | 'color' | 'url';
} & React.InputHTMLAttributes<HTMLInputElement>) => {
    const { setFieldValue, setFieldTouched, errors, touched, values } = useFormikContext<{
        [key: string]: any;
    }>();
    const { t, i18n } = useTranslation();

    // State to toggle password visibility
    const [showPassword, setShowPassword] = useState(false);

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Determine if the current language is 'ar'
    const isRTL = i18n.language === 'ar';

    return (
        <div className="col-span-1">
            <div className="flex flex-col gap-1">
                {label && (
                    <Label htmlFor={id} {...labelProps} required={required} className="mb-1">
                        {t(label)}
                    </Label>
                )}
                {type == 'file' ? (
                    <UploadImg name={props?.name} />
                ) : type == 'textarea' ? (
                    //@ts-ignore
                    <TextAreaField
                        //@ts-ignore
                        rows="5"
                        name={props?.name}
                        label={props?.label}
                        //@ts-ignore
                        {...props}
                        placeholder={props?.placeholder}
                        id={id}
                    />
                ) : (
                    <div className="relative">
                        <input
                            disabled={disabled}
                            type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                            id={id}
                            {...props}
                            value={
                                formatNumbers
                                    ? formatNumber(props.value || values[props.name])
                                    : props.value || values[props.name]
                            }
                            placeholder={t(placeholder)}
                            error={touched[props.name] && !!errors[props.name]}
                            autoComplete="off"
                            onBlur={() => {
                                setFieldTouched(props.name, true);
                            }}
                            onChange={(e) => {
                                let inputValue = e.target.value;
                                inputValue = inputValue.replace(/[^0-9]/g, '');

                                const formattedValue = formatNumbers
                                    ? formatNumber(inputValue.replace(/,/g, ''))
                                    : e.target.value;
                                if (props.value === undefined) {
                                    setFieldValue(props.name, formattedValue);
                                }
                            }}
                            className="form-input px-4 py-[.70rem] w-full shadows"
                        />

                        {/* <BaseInput
                            type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                            id={id}
                            {...props}
                            value={
                                formatNumbers
                                    ? formatNumber(props.value || values[props.name])
                                    : props.value || values[props.name]
                            }
                            //@ts-ignore
                            placeholder={t(placeholder)}
                            error={touched[props.name] && !!errors[props.name]}
                            autoComplete="off"
                            onBlur={() => {
                                setFieldTouched(props.name, true);
                            }}
                            onChange={(e) => {
                                let inputValue = e.target.value;
                                inputValue = inputValue.replace(/[^0-9]/g, '');

                                const formattedValue = formatNumbers
                                    ? formatNumber(inputValue.replace(/,/g, ''))
                                    : e.target.value;
                                if (props.value === undefined) {
                                    setFieldValue(props.name, formattedValue);
                                }
                            }}
                        /> */}
                        {type === 'password' && (
                            <div
                                className={`absolute inset-y-0 ${isRTL ? 'left-3' : 'right-3'
                                    } flex items-center cursor-pointer`}
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <FormikError name={props.name} />
        </div>
    );
};
