import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { CountryPhoneCodes } from '../../helper/country-phone-code';
import { Label } from './Label';
import useFetch from '../../hooks/UseFetch';
import { Skeleton } from '@mantine/core';

const PhoneInput2 = ({ name, label }: any) => {
    const baseURLGeneral = import.meta.env.VITE_BASE_GENERAL_URL;
    const { setFieldValue, handleBlur, values } = useFormikContext<any>();
    const formatPhoneNumber = (phoneCode: string, phone: string): string => {
        const dial_code =
            CountryPhoneCodes?.find((country) => `+${phoneCode}` == country?.dial_code) || '';
        //@ts-ignore
        return `${dial_code?.dial_code}${phone}`;
    };

    const [phone, setPhone] = useState(formatPhoneNumber(values?.phone_code, values?.phone) || '');

    const handlePhoneChange = (value: any, selectedCountry: any) => {
        const phone = +value
            ?.slice(selectedCountry?.dialCode?.length)
            ?.trim()
            ?.split(' ')
            ?.join('');
        setFieldValue('phone', phone);
        setPhone(value);
        setFieldValue('phone_code', selectedCountry?.dialCode);
    };

    const [loading, setLoading] = useState(false);
    const [countries, setCountries] = useState<any[]>([]);

    const fetchCountries = async () => {
        if (countries.length > 0) {
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${baseURLGeneral}/get_countries`);
            const data = await response.json();

            const formattedCountries = data.data.map((country: any) => ({
                name: country.name,
                shortName: country.short_name,
                dialCode: country.phone_code,
            }));

            setCountries(formattedCountries);

            if (values?.phone_code) {
                const foundCountry = formattedCountries.find(
                    (c: any) => c.dialCode === values?.phone_code
                );
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

    const onlyCountries = countries.map((country) => country.shortName).filter(Boolean);
    return (
        <div className="col-span-1">
            <div className="flex flex-col gap-1 ">
                <Label htmlFor={name} className="mb-1">
                    {label}
                </Label>
                {loading ? (
                    <Skeleton height={40} className="w-full" />
                ) : (
                    <PhoneInput
                        onlyCountries={onlyCountries.length > 0 ? onlyCountries : ['']}
                        country={countries[0]?.shortName}
                        value={phone || ''}
                        onChange={handlePhoneChange}
                        enableSearch
                        onBlur={handleBlur}
                    />
                )}
            </div>
        </div>
    );
};

export default PhoneInput2;
