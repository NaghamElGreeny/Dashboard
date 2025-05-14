import { useState, useRef, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { Label } from '../Label';
import { useFormikContext } from 'formik';
import { CountryPhoneCodes } from '../../../helper/country-phone-code';

export const CustomInputPhone = ({ label, name }: any) => {
    const { setFieldValue, values } = useFormikContext<any>();
    const inputRef = useRef<HTMLInputElement>(null);

    const getDialCode = (phoneCode: string): string => {
        return CountryPhoneCodes?.find((country) => `+${phoneCode}` === country?.dial_code)
            ?.dial_code || '';
    };

    const initialDialCode = getDialCode(values?.phone_code);
    const [dialCode, setDialCode] = useState(initialDialCode);
    const [phone, setPhone] = useState(`${initialDialCode}${values?.phone || ''}`);

    const handlePhoneChange = (value: string, selectedCountry: any) => {
        const newDialCode = `+${selectedCountry?.dialCode}`;
        setDialCode(newDialCode);

        let currentValue = value;
        if (!currentValue.startsWith(newDialCode)) {
            // فرض وجود الكود في البداية
            currentValue = newDialCode + currentValue.replace(/^\+?\d+/, '');
        }

        const numberOnly = currentValue.slice(newDialCode.length);
        setPhone(currentValue);
        setFieldValue('phone', numberOnly);
        setFieldValue('phone_code', selectedCountry?.dialCode);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = inputRef.current;
        if (!input) return;

        const selectionStart = input.selectionStart ?? 0;
        const selectionEnd = input.selectionEnd ?? 0;
        const codeLength = dialCode.length;

        // ممنوع التحديد أو المسح داخل كود الدولة
        const isBackspaceAtCode = e.key === 'Backspace' && selectionStart <= codeLength;
        const isDeleteAtCode = e.key === 'Delete' && selectionStart < codeLength;
        const isSelectingCode = selectionStart < codeLength || selectionEnd < codeLength;

        if (isBackspaceAtCode || isDeleteAtCode || isSelectingCode) {
            e.preventDefault();
            // نحرك الكيرسور بعد كود الدولة
            setTimeout(() => {
                input.setSelectionRange(codeLength, codeLength);
            }, 0);
        }
    };

    const handleClick = () => {
        const input = inputRef.current;
        if (input) {
            const cursorPos = input.selectionStart ?? 0;
            if (cursorPos < dialCode.length) {
                input.setSelectionRange(dialCode.length, dialCode.length);
            }
        }
    };

    useEffect(() => {
        // لو القيمة اتمسحت كلها لأي سبب، نرجّع كود الدولة
        if (!phone.startsWith(dialCode)) {
            setPhone(dialCode);
        }
    }, [phone, dialCode]);

    return (
        <div className="col-span-1">
            <div className="flex flex-col gap-1">
                <Label htmlFor={name} className="mb-1">
                    {label}
                </Label>
                <PhoneInput
                    country="eg"
                    enableSearch
                    value={phone}
                    onChange={handlePhoneChange}
                    inputStyle={{ width: '100%', height: '44px' }}
                    inputProps={{
                        ref: inputRef,
                        onKeyDown: handleKeyDown,
                        onClick: handleClick,
                    }}
                />
            </div>
        </div>
    );
};
