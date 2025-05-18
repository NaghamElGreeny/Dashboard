import { Skeleton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';
import CKeditor from '../../atoms/EditorCustom';

export default function WhyUsMainData(
    {
        isLoading,
        formik,
        data,
    }: {
        isLoading?: boolean;
        formik?: any;
        data?: any;
    }
) {
    const { t } = useTranslation();

    return (
        <>
            <div className="grid grid-cols-1 gap-2">
                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.title') + t('inArabic')}
                            name="ar_key"
                            id="ar_key"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.title')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.title') + t('inEnglish')}
                            name="en_key"
                            id="en_key"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.title')}
                        />
                    )}
                </div>
                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.value')}
                            name="value"
                            id="value"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.value')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    <label className="block mb-1">{t('labels.image')}</label>

                    <div className="mt-2">
                        {isLoading ? (
                            <Skeleton height={96} width={96} className="rounded-full" />
                        ) : data?.data?.icon?.url ? (
                            <img
                                src={data.data.icon.url}
                                alt="Current icon"
                                className="w-24 h-24 object-cover rounded-full border"
                            />
                        ) : (
                            <span className="text-gray-400 text-sm">{t('not_found')}</span>
                        )}
                    </div>

                    <input
                        id="icon"
                        type="file"
                        name="icon"
                        accept="image/*"
                        className="mt-2"
                        onChange={(event) => {
                            formik.setFieldValue('icon', event.currentTarget.files?.[0] || null);
                        }}
                    />
                    {/* {formik.errors.icon && (
                        <div className="text-red-500 text-sm">{formik.errors.icon}</div>
                    )} */}
                </div>



            </div>
        </>
    );
}
