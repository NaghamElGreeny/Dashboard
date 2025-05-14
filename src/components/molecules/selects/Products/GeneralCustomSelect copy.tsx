import Select from 'react-select';
import useFetch from '../../../../hooks/UseFetch';
import { Label } from '../../../atoms';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

type OptionType = {
    value: string | number;
    label: string;
};

interface SelectComponentProps {
    name: string;
    api?: string;
    label?: string;
    placeholder?: string;
    onChange: (option: OptionType) => void;
    required?: boolean;
    index?: number;
    arrayName?: string;
    optionsList?: OptionType[]; // Static options
}

function GeneralCustomSelect({
    name,
    api,
    label,
    placeholder,
    onChange,
    required,
    index,
    optionsList,
    arrayName = 'product_details',
    ...props
}: SelectComponentProps) {
    const { values, errors, touched, setFieldTouched } = useFormikContext<any>();
    const { t } = useTranslation();

    // Fetch data if API is provided and no static optionsList
    const { data: fetchedData } = useFetch<any>({
        endpoint: api || '', // Avoid calling API if it's not provided
        //    @ts-ignore
        queryKey: api ? [api] : [],
        enabled: !!api, // Only enable fetching if API is provided
    });

    // Determine the source of options: API response or provided list
    const options: OptionType[] = optionsList
        ? optionsList
        : fetchedData?.data?.map((item: any) => ({
              label: item?.title,
              value: item?.id,
          })) || [];

    // Retrieve the value dynamically based on name prop and index
    const fieldValue = index !== undefined ? values[arrayName]?.[index]?.[name] : values[name];

    // Find the selected option
    const selectOption = options.find((option) => option.value === fieldValue) || null;

    return (
        <div className="flex flex-col gap-1">
            <Label htmlFor={name} required={required}>
                {label}
            </Label>
            <Select
                options={options}
                placeholder={placeholder}
                name={name}
                classNames={{
                    control: () => `!border-[#E0E6ED] dark:border-[#17263c] dark:bg-[#121e32]`,
                    menu: () => 'dark:border-[#17263c] dark:bg-[#121e32]',
                    menuList: () =>
                        'dark:border-[#17263c] dark:bg-[#121e32] hover:!dark:bg-[#121e32]',
                }}
                value={selectOption ? selectOption : ''}
                onChange={(selectedOption: any) => {
                    onChange(selectedOption);
                }}
                onBlur={() => setFieldTouched(name, true)}
                styles={{
                    control: (baseStyles, state) => ({
                        ...baseStyles,
                        padding: '2px',
                        borderColor:
                            touched[name] && errors[name] && typeof errors[name] === 'string'
                                ? '#f44336'
                                : state.isFocused
                                ? '#000000' // Replace with your primary color
                                : baseStyles.borderColor,
                        boxShadow: state.isFocused ? '0 0 0 1px #000000' : baseStyles.boxShadow,
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
                {...props}
            />
            {touched[name] && errors[name] && typeof errors[name] === 'string' && (
                <div className="text-red-500 text-sm">{errors[name] as string}</div>
            )}
        </div>
    );
}

export default GeneralCustomSelect;
