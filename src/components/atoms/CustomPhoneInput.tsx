import { Skeleton } from '@mantine/core';
import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CountryPhoneCodes } from '../../helper/country-phone-code';
import Dropdown from '../Dropdown';
import { Label } from './Label';
import Cookies from 'js-cookie';
import imageError from '/assets/images/logo.png';

const CustomPhoneInput = ({ name, label }: any) => {
    const { t, i18n } = useTranslation();

    const BASE_URL = import.meta.env.VITE_BASE_GENERAL_URL;

    const user_token = Cookies.get('token');
    const token = user_token;

    const authorizationHeader = `Bearer ${token}`;

    const { setFieldValue, values, setFieldTouched, errors, touched, handleBlur } =
        useFormikContext<any>();

    // const formatPhoneNumber = (phoneCode: string, phone: string): string => {
    //     const dial_code: any =
    //         CountryPhoneCodes?.find((country) => `+${phoneCode}` == country?.dial_code) || '';
    //     return `${dial_code?.dial_code}${phone}`;
    // };
    const formatPhoneNumber = (phone: string): string => {
        return phone;
    };

    const [phone, setPhone] = useState(formatPhoneNumber(values?.phone) || '');
    const [loading, setLoading] = useState(false);
    const [countries, setCountries] = useState<any[]>([]);

    const fetchCountries = async () => {
        if (countries.length > 0) {
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/countries/list-without-pag`, {
                headers: {
                    Authorization: authorizationHeader,
                    'Accept-Language': i18n.language,
                },
            });
            const data = await response.json();

            const formattedCountries = data?.data?.map((country: any) => ({
                name: country.name,
                // shortName: country.short_name,
                dialCode: country.phone_code,
                flag: country.flag,
            }));

            setCountries(formattedCountries);
            // If no phone_code is set, set the first country as the default
            if (!values?.phone_code && formattedCountries.length > 0) {
                const firstCountry = formattedCountries[0];
                setFieldValue('phone_code', firstCountry.dialCode);
            }
        } catch (error) {
            console.error('Error fetching countries:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (countries.length === 0) {
            fetchCountries();
        }
    }, [countries.length]);

    const handlePhoneChange = (value: any) => {
        const phone = value.trim();
        setFieldValue('phone', phone); // Save phone number only
        setPhone(value);
    };

    const handleCountrySelect = (selectedCountry: any) => {
        setFieldValue('phone_code', selectedCountry.dialCode); // Save country code separately
        setPhone('');
    };

    // const handlePhoneChange = (value: any, selectedCountry: any) => {
    //     const phone = +value
    //         ?.slice(selectedCountry?.dialCode?.length)
    //         ?.trim()
    //         ?.split(' ')
    //         ?.join('');
    //     setFieldValue('phone', phone);
    //     setPhone(value);
    //     setFieldValue('phone_code', selectedCountry?.dialCode);
    // };

    // const handleCountrySelect = (selectedCountry: any) => {
    //     setFieldValue('phone_code', selectedCountry.dialCode);
    //     setPhone(`${selectedCountry.dialCode}`);
    // };

    return (
        <div className="col-span-1">
            <div className="flex flex-col gap-1">
                <Label htmlFor={name} className="mb-1">
                    {label}
                </Label>
                {loading ? (
                    <Skeleton height={40} className="w-full" />
                ) : (
                    <>
                        <div className="flex items-center">
                            {/* Phone Number Input */}
                            <input
                                type="text"
                                placeholder={t('enter') + ' ' + t('labels.phone')}
                                className="mx-2 p-2 py-3 dark:border-[#17263c] dark:bg-[#121e32] border rounded-lg focus:outline-none focus:ring-2 focus:ring-transparent focus:border-primary border-gray-300 w-full"
                                value={phone || ''}
                                onChange={(e) => handlePhoneChange(e.target.value)}
                                // onChange={(e) =>
                                //     handlePhoneChange(e.target.value, { dialCode: values.phone_code })
                                // }
                                // onBlur={handleBlur}
                                onBlur={() => {
                                    setFieldTouched(name, true);
                                }}
                            />

                            {/* Dropdown for selecting country */}
                            <div className="relative">
                                <Dropdown
                                    button={
                                        <div className="py-3 flex dark:border-[#17263c] dark:bg-[#121e32] items-center p-2 px-5 border rounded-lg border-primary text-primary">
                                            {/* Display selected country's flag and code */}
                                            <img
                                                onError={(e: any) => (e.target.src = imageError)}
                                                src={
                                                    countries.find(
                                                        (c) => c.dialCode == values.phone_code
                                                    )?.flag || imageError
                                                }
                                                alt="flag"
                                                className="w-6 h-4"
                                            />
                                            <span className="text-gray-500 mx-1">
                                                {values.phone_code}
                                            </span>
                                        </div>
                                    }
                                >
                                    <div className="absolute top-full dark:border-[#17263c] dark:bg-[#121e32] right-0 mt-2 bg-white shadow-md rounded-lg border border-primary z-50 max-h-48 w-20 overflow-y-auto">
                                        {countries.map((country) => (
                                            <div
                                                key={country.dialCode}
                                                className="dropdown-item flex items-center p-2 cursor-pointer hover:bg-secondary hover:text-white"
                                                onClick={() => handleCountrySelect(country)}
                                            >
                                                <img
                                                    onError={(e: any) =>
                                                        (e.target.src = imageError)
                                                    }
                                                    src={country?.flag || imageError}
                                                    alt="flag"
                                                    className="w-6 h-4 mx-1"
                                                />
                                                <span className="text-gray-700">
                                                    {country?.dialCode}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </Dropdown>
                            </div>
                        </div>

                        {touched[name] && errors[name] && typeof errors[name] === 'string' && (
                            <div className="text-red-500 text-sm ">{errors[name] as string}</div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CustomPhoneInput;
