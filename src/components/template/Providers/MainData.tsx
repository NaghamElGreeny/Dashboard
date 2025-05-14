import { Skeleton } from '@mantine/core';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import GeneralSelect from '../../molecules/selects/GeneralSelect';

export default function MainDataProviders({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();

    const { setFieldValue } = useFormikContext<{ [key: string]: any }>();

    return (
        <>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralSelect
                            isGeneral={true}
                            label={t('labels.category')}
                            placeholder={t('select') + ' ' + t('labels.category')}
                            apiName="category/list-without-pag"
                            name="category_id"
                            onChange={(option: any) => setFieldValue('category_id', option)}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralSelect
                            isGeneral={true}
                            label={t('labels.sub_category')}
                            placeholder={t('select') + ' ' + t('labels.sub_category')}
                            apiName="subcategory/list-without-pag"
                            name="subcategory_id"
                            onChange={(option: any) => setFieldValue('subcategory_id', option)}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
