import Select from 'react-select';
import { Label } from '../../atoms';
import { useFormikContext } from 'formik';

export default function GeneralStaticSelect({
    onChange,
    defaultValue,
    required,
    name,
    label,
    placeholder,
    dataOptions,
    disabled = false,
    isClear = true,
    ...props
}: any) {
    const { values, errors, touched, setFieldTouched } = useFormikContext<any>();

    return (
        <div className="flex flex-col gap-1">
            <Label htmlFor={name} required={required}>
                {label}
            </Label>
            <Select
                isDisabled={disabled}
                placeholder={placeholder}
                defaultValue={dataOptions.find((option: any) => option.value === values[name])}
                options={dataOptions}
                isClearable={isClear}
                styles={{
                    control: (baseStyles, state) => ({
                        ...baseStyles,
                        padding: '2px',
                        borderColor:
                            touched[name] && errors[name] && typeof errors[name] === 'string'
                                ? '#f44336' // Tailwind error color
                                : state.isFocused
                                    ? '#3067DE' // Tailwind "primary" color (blue-500)
                                    : baseStyles.borderColor,
                        boxShadow: state.isFocused
                            ? '0 0 0 1px #3067DE' // Optional focus shadow
                            : baseStyles.boxShadow,
                        zIndex: 0, // Ensure this is lower than the dropdown
                    }),
                    menu: (baseStyles) => ({
                        ...baseStyles,
                        zIndex: 9999, // High z-index to render above other elements
                    }),
                    menuPortal: (baseStyles) => ({
                        ...baseStyles,
                        zIndex: 9999, // Ensures the portal is on top
                    }),
                }}
                classNames={{
                    control: (state) =>
                        `!border-[#E0E6ED] dark:border-[#17263c] dark:bg-[#121e32] ${state.isFocused
                            ? 'focus:border-primary focus:ring focus:ring-primary'
                            : ''
                        }`,
                    menu: () => 'dark:border-[#17263c] dark:bg-[#121e32] dark:text-white',
                    menuList: () =>
                        'dark:border-[#17263c] dark:bg-[#121e32] hover:!dark:bg-[#121e32]',
                }}
                menuPortalTarget={document.body} // Render the menu in a portal attached to the body
                name={name}
                onChange={(option) => {
                    if (onChange) {
                        onChange(option); // Pass the option back to the parent component
                    }
                    // setFieldValue(name, option?.value || ''); // Update Formik's field value
                }}
                onBlur={() => setFieldTouched(name, true)}
                {...props}
            />
            {touched[name] && errors[name] && typeof errors[name] === 'string' && (
                <div className="text-red-500 text-sm">{errors[name] as string}</div>
            )}
        </div>
    );
}
