import { Skeleton } from '@mantine/core';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../../atoms/BaseInputField';

export default function MainDataGeneral({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();
    const { values, setFieldValue } = useFormikContext<{ [key: string]: any }>();

    const fields = [
        {
            name: 'whatsapp',
            type: 'url',
            label: `${t('labels.whatsapp')}`,
            placeholder: `${t('enter') + ' ' + t('labels.whatsapp')}`,
        },

        {
            name: 'facebook',
            type: 'url',
            label: `${t('labels.facebook_link')}`,
            placeholder: `${t('enter') + ' ' + t('labels.facebook_link')}`,
        },

        {
            name: 'x',
            type: 'url',
            label: `${t('labels.x_link')}`,
            placeholder: `${t('enter') + ' ' + t('labels.x_link')}`,
        },

        {
            name: 'linkedIn',
            type: 'url',
            label: `${t('labels.linkedIn_link')}`,
            placeholder: `${t('enter') + ' ' + t('labels.linkedIn_link')}`,
        },

        {
            name: 'snapchat',
            type: 'url',
            label: `${t('labels.snapchat_link')}`,
            placeholder: `${t('enter') + ' ' + t('labels.snapchat_link')}`,
        },

        {
            name: 'tiktok',
            type: 'url',
            label: `${t('labels.tiktok_link')}`,
            placeholder: `${t('enter') + ' ' + t('labels.tiktok_link')}`,
        },
    ];

    return (
        <div className="grid grid-cols-12 gap-2">
            {fields.map(({ name, type, label, placeholder }, index) => (
                <div key={index} className="col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={label}
                            name={name}
                            id={name}
                            // @ts-ignore
                            type={type || 'text'}
                            className="border"
                            placeholder={placeholder}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
