import { Skeleton } from '@mantine/core';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../../atoms/BaseInputField';

export default function MainDataSocial({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();
    const { values } = useFormikContext<{ [key: string]: any }>();

    const fields = [
        { name: 'sms_username', type: 'text', label: 'labels.sms_username' },
        { name: 'sms_password', type: 'password', label: 'labels.sms_password' },
        { name: 'sms_sender_name', type: 'text', label: 'labels.sms_sender_name' },
        { name: 'sms_provider', type: 'text', label: 'labels.sms_provider' },
    ];

    return (
        <div className="grid grid-cols-12 gap-2">
            {fields.map(({ name, type, label }, index) => (
                <div key={index} className="col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t(label)}
                            name={name}
                            id={name}
                            // @ts-ignore
                            type={type}
                            className="border"
                            placeholder={t('enter') + ' ' + t(label)}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
