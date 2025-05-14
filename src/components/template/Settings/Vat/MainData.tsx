import { Skeleton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../../atoms/BaseInputField';

export default function VatMainData({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();

    return (
        <>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.vat')}
                            name="vat_value"
                            id="vat_value"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.vat')}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
