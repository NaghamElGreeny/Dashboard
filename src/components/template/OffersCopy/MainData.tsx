import { Skeleton } from '@mantine/core';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DateInput from '../../atoms/DateInput';
import GeneralStaticSelect from '../../molecules/selects/GeneralStaticSelect';
import ProductsFieldArray from './ProductsFieldArray';
import TestProductsFieldArray from './TestProductsFieldArray';

export default function MainDataOffer({
    isLoading,
    initialProductIds,
    onChangeProductId,
}: {
    isLoading?: boolean;
    initialProductIds?: Array<{
        product_id: string;
        product_detail_id: string;
        discount: number;
    }>;
    onChangeProductId?: (e: any) => any;
}) {
    const { t } = useTranslation();
    const id = useParams();

    const date = new Date();

    const { setFieldValue, values } = useFormikContext<{
        [key: string]: any;
    }>();

    const typesList = [
        { id: 0, value: 'flash_sale', label: t('labels.flash_sale') },
        { id: 1, value: 'offer', label: t('labels.offer') },
    ];

    const statusList = [
        { id: 0, value: 0, status: false, label: t('no') },
        { id: 1, value: 1, status: true, label: t('yes') },
    ];

    return (
        <>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 sm:col-span-6">
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
                        <GeneralStaticSelect
                            name="is_active"
                            dataOptions={statusList}
                            label={t('labels.status')}
                            placeholder={t('select')}
                            onChange={(option: any) => setFieldValue('is_active', option?.value)}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <DateInput
                            minDateValue={id && id.id ? '' : date}
                            label={t('labels.start_date')}
                            name="start_at"
                            placeholder={t('enter') + ' ' + t('labels.start_date')}
                            defaultValue={values.start_at}
                            disabled={false}
                            required={false}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <DateInput
                            minDateValue={values.start_at}
                            label={t('labels.end_date')}
                            name="end_at"
                            placeholder={t('enter') + ' ' + t('labels.end_date')}
                            defaultValue={values.end_at}
                            disabled={!values.start_at}
                            required={false}
                        />
                    )}
                </div>
            </div>

            {/* products */}
            <ProductsFieldArray
                isLoading={isLoading}
                initialProductIds={initialProductIds}
                onChangeProductId={onChangeProductId}
            />
        </>
    );
}
