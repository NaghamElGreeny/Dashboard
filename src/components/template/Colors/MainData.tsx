import { Skeleton } from '@mantine/core';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import BaseColorInputField from '../../atoms/BaseColorInputField';
import { BaseInputField } from '../../atoms/BaseInputField';

export default function MainDataCities({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();
    const { setFieldValue, errors, touched, values } = useFormikContext<{
        [key: string]: any;
    }>();

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

                {/* <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.color')}
                            name="hex"
                            id="hex"
                            type="color"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.color')}
                        />
                    )}
                </div> */}

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseColorInputField
                            label={t('labels.color')}
                            name="hex"
                            id="hex"
                            placeholder={t('enter') + ' ' + t('labels.color')}
                            // required={true}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
