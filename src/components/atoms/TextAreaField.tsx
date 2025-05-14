import { useFormikContext } from 'formik';
import { TextAreaInput, TextAreaInputProp_TP } from './TextAreaInput';
import { Label } from './Label';
import { FormikError } from './FormikError';

export const TextAreaField = ({
    label,
    name,
    placeholder,
    id,
    required,
    ...props
}: {
    label?: string;
    id?: string;
    name?: any;
    placeholder?: string;
} & TextAreaInputProp_TP) => {
    const { setFieldValue, setFieldTouched, errors, touched, values } = useFormikContext<{
        [key: string]: any;
    }>();
    return (
        <TextAreaInput
            placeholder={placeholder}
            id={id}
            value={props.value || values[name]}
            className={`${
                touched[name as string] && !!errors[name as string] && '!border-mainRed border-2'
            }  border border-gray-200 text-area`}
            onChange={(e) => {
                if (props.value === undefined) {
                    // setFieldValueState(e.target.value)
                    setFieldValue(name, e.target.value);
                }
            }}
            onBlur={() => {
                setFieldTouched(name as string, true);
            }}
            {...props}
        />
    );
};
