import { Skeleton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';
import GeneralSelect from '../../molecules/selects/GeneralSelect';
import { useFormikContext } from 'formik';

export default function MainDataDistricts({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();

    const { setFieldValue } = useFormikContext<{ [key: string]: any }>();

    return (
        <>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.name') + t('inArabic')}
                            name="ar_name"
                            id="ar_name"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.name')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.name') + t('inEnglish')}
                            name="en_name"
                            id="en_name"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.name')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralSelect
                            isGeneral={true}
                            label={t('labels.city')}
                            placeholder={t('select') + ' ' + t('labels.city')}
                            apiName="cities/list-without-pag"
                            name="city_id"
                            onChange={(option: any) => setFieldValue('city_id', option)}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
