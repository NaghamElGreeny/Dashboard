import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';
import { Skeleton } from '@mantine/core';

export default function MainDataSizes({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();

    const { setFieldValue, values } = useFormikContext<{ [key: string]: any }>();

    return (
        <>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.title') + t('inArabic')}
                            name="ar_title"
                            id="ar_title"
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
                            name="en_title"
                            id="en_title"
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
                            label={t('labels.abbreviation') + t('inArabic')}
                            name="ar_tag"
                            id="ar_tag"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.abbreviation')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.abbreviation') + t('inEnglish')}
                            name="en_tag"
                            id="en_tag"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.abbreviation')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.order')}
                            name="ordering"
                            id="ordering"
                            type="number"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.order')}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
