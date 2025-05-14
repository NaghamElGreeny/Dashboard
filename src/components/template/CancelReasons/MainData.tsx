import { Skeleton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';

export default function MainDataCancelReasons({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();

    return (
        <>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.reason') + t('inArabic')}
                            name="ar_reason"
                            id="ar_reason"
                            type="textarea"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.reason')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.reason') + t('inEnglish')}
                            name="en_reason"
                            id="en_reason"
                            type="textarea"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.reason')}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
