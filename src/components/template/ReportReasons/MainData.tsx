import { Skeleton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';
import GeneralStaticSelect from '../../molecules/selects/GeneralStaticSelect';
import { useFormikContext } from 'formik';

export default function MainDataReportReasons({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();
    const { setFieldValue, values } = useFormikContext<{ [key: string]: any }>();

    const typesList = [
        {
            id: 0,
            value: 'client',
            label: t('labels.client'),
        },
        {
            id: 1,
            value: 'provider',
            label: t('labels.provider'),
        },
    ];

    return (
        <>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralStaticSelect
                            name="type"
                            dataOptions={typesList}
                            label={t('labels.type')}
                            placeholder={t('select') + ' ' + t('labels.type')}
                            onChange={(option: any) => setFieldValue('type', option?.value)}
                        />
                    )}
                </div>

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
