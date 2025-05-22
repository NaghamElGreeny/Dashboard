import { Skeleton } from '@mantine/core';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../../atoms/BaseInputField';

export default function MainDataGeneral({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();
    const { values, setFieldValue } = useFormikContext<{ [key: string]: any }>();

    const fields = [
        {
            name: 'ar_desc',
            type: 'text',
            label: `${t('labels.description') + ' ' + t('inArabic')}`,
            placeholder: `${t('enter') + ' ' + t('labels.description') + ' ' + t('inArabic')}`,
        },
        {
            name: 'en_desc',
            type: 'text',
            label: `${t('labels.description') + ' ' + t('inEnglish')}`,
            placeholder: `${t('enter') + ' ' + t('labels.description') + ' ' + t('inEnglish')}`,
        },
        {
            name: 'phone',
            type: 'phone',
            label: `${t('labels.phone')}`,
            placeholder: `${t('enter') + ' ' + t('labels.phone')}`,
        },
        {
            name: 'email',
            type: 'email',
            label: `${t('labels.email')}`,
            placeholder: `${t('enter') + ' ' + t('labels.email')}`,
        },
        {
            name: 'address',
            type: 'address',
            label: `${t('labels.address')}`,
            placeholder: `${t('enter') + ' ' + t('labels.address')}`,
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
            name: 'instagram',
            type: 'url',
            label: `${t('labels.instagram_link')}`,
            placeholder: `${t('enter') + ' ' + t('labels.instagram_link')}`,
        },

        {
            name: 'appoitnments',
            // type: 'url',
            label: `${t('appointments')}`,
            placeholder: `${t('enter') + ' ' + t('appointments')}`,
        },
    ];

    return (
        <div className="grid grid-cols-12 gap-2">
            {fields.map(({ name, type, label, placeholder }, index) => (
                <div key={index} className="col-span-12 sm:col-span-6">
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
