import { Skeleton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';

export default function MainDataLanguages({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();

    return (
        <>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.language') + t('inArabic')}
                            name="ar_language"
                            id="ar_language"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.language')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.language') + t('inEnglish')}
                            name="en_language"
                            id="en_language"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.language')}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
