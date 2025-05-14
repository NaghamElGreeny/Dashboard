import Select from 'react-select';
import useFetch from '../../../hooks/UseFetch';
import { Label } from '../../atoms';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

type OptionType = {
    value: string;
    label: string;
};

type GeneralSelectUserProps = {
    onChange: (value: any) => void;
    required?: boolean;
    apiName: string;
    name: string;
    label: string;
    placeholder?: string;
    isMultiple?: boolean;
    disabled?: boolean;
    isGeneral?: boolean;
    [x: string]: any;
};

function GeneralSelect({
    onChange,
    required,
    apiName,
    name,
    label,
    placeholder,
    isMultiple = false,
    isGeneral = false,
    disabled = false,
    ...props
}: GeneralSelectUserProps) {
    const { values, errors, touched, setFieldTouched } = useFormikContext<any>();
    const { t } = useTranslation();

    const { data: SelectData } = useFetch<any>({
        endpoint: apiName,
        queryKey: [apiName],
        general: isGeneral,
    });

    const options: OptionType[] =
        SelectData?.data?.map((item: any) => ({
            label:
                item?.name || item?.store_name || item?.full_name || item?.title || item?.service,
            value: item.id,
        })) || [];

    const selectedOptions = isMultiple
        ? options.filter((option) => values[name]?.includes(option.value))
        : options.find((option) => option.value === values[name]);

    return (
        <div className="flex flex-col gap-1">
            <Label htmlFor={name} required={required}>
                {label}
            </Label>
            <Select
                isDisabled={disabled}
                isMulti={isMultiple}
                placeholder={placeholder}
                options={options}
                isClearable
                styles={{
                    control: (baseStyles, state) => ({
                        ...baseStyles,
                        padding: '2px',
                        borderColor:
                            touched[name] && errors[name] && typeof errors[name] === 'string'
                                ? '#f44336'
                                : state.isFocused
                                ? '#3067DE' // Replace with your primary color
                                : baseStyles.borderColor,
                        boxShadow: state.isFocused
                            ? '0 0 0 1px #3067DE' // Optional focus shadow
                            : baseStyles.boxShadow,
                        zIndex: 0,
                    }),
                    menu: (baseStyles) => ({
                        ...baseStyles,
                        zIndex: 9999,
                    }),
                    menuPortal: (baseStyles) => ({
                        ...baseStyles,
                        zIndex: 9999,
                    }),
                }}
                classNames={{
                    control: () => `!border-[#E0E6ED] dark:border-[#17263c] dark:bg-[#121e32]`,
                    menu: () => 'dark:border-[#17263c] dark:bg-[#121e32] dark:text-white',
                    menuList: () =>
                        'dark:border-[#17263c] dark:bg-[#121e32] hover:!dark:bg-[#121e32]',
                }}
                menuPortalTarget={document.body}
                name={name}
                value={selectedOptions}
                onChange={(selected: any) => {
                    if (isMultiple) {
                        const selectedValues = selected.map((option: any) => option.value);
                        onChange(selectedValues);
                    } else {
                        onChange(selected ? selected.value : '');
                    }
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

export default GeneralSelect;
