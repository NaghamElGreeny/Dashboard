import { Skeleton } from '@mantine/core';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DateInput from '../../atoms/DateInput';
import { BaseInputField } from '../../atoms/BaseInputField';
import TimeInp from '../../atoms/inputs/TimeInp';
import GeneralStaticSelect from '../../molecules/selects/GeneralStaticSelect';
import ProductFieldArray from './ProductFieldArray';

export default function MainDataCoupons({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();
    const { setFieldValue, values } = useFormikContext<{ [key: string]: any }>();
    const id = useParams();
    const date = new Date();

    const couponTypes = [
        { id: 0, value: 'coupon', label: t('labels.coupon') },
        { id: 1, value: 'free_shipping', label: t('labels.free_shipping') },
    ];

    const discountTypes = [
        { id: 0, value: 'value', label: t('labels.value') },
        { id: 1, value: 'percentage', label: t('labels.percentage') },
    ];

    const couponForList = [
        { id: 0, value: 'category', label: t('labels.categories') },
        { id: 1, value: 'product', label: t('labels.products') },
    ];

    const statusList = [
        { id: 0, value: 0, status: false, label: t('labels.inactive') },
        { id: 1, value: 1, status: true, label: t('labels.active') },
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
                            dataOptions={couponTypes}
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
                            label={t('labels.code')}
                            name="code"
                            id="code"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.code')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralStaticSelect
                            name="discount_type"
                            dataOptions={discountTypes}
                            label={t('labels.discount_type')}
                            placeholder={t('select') + ' ' + t('labels.discount_type')}
                            onChange={(option: any) =>
                                setFieldValue('discount_type', option?.value)
                            }
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.discount')}
                            name="discount"
                            id="discount"
                            type="number"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.discount')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.max_discount')}
                            name="max_discount"
                            id="max_discount"
                            type="number"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.max_discount')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.max_limit')}
                            name="max_used_num"
                            id="max_used_num"
                            type="number"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.max_limit')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.usage_limit')}
                            name="max_used_for_user"
                            id="max_used_for_user"
                            type="number"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.usage_limit')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.min_price')}
                            name="min_price"
                            id="min_price"
                            type="number"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.min_price')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={100} className="w-full" />
                    ) : (
                        <DateInput
                            minDateValue={id && id.id ? '' : date}
                            label={t('labels.start_date')}
                            name="start_date"
                            placeholder={t('enter') + ' ' + t('labels.start_date')}
                            defaultValue={values.start_date}
                            disabled={false}
                            required={false}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={100} className="w-full" />
                    ) : (
                        <DateInput
                            minDateValue={values.start_date}
                            label={t('labels.end_date')}
                            name="end_date"
                            placeholder={t('enter') + ' ' + t('labels.end_date')}
                            defaultValue={values.end_date}
                            disabled={!values.start_date}
                            required={false}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <TimeInp
                            label={t('labels.start_time')}
                            name="start_time"
                            defaultValue={values.start_time}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <TimeInp
                            label={t('labels.end_time')}
                            name="end_time"
                            defaultValue={values.end_time}
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
                            placeholder={t('select') + ' ' + t('labels.status')}
                            onChange={(option: any) => setFieldValue('is_active', option?.value)}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralStaticSelect
                            name="product_list_type"
                            dataOptions={couponForList}
                            label={t('labels.coupon_for')}
                            placeholder={t('select') + ' ' + t('labels.coupon_for')}
                            onChange={(option: any) => {
                                setFieldValue('product_list_type', option?.value);
                                setFieldValue('products', [
                                    { product_id: '', product_detail_id: '' },
                                ]); // Initialize products
                            }}
                        />
                    )}
                </div>
            </div>

            {/* products */}
            {values.product_list_type && <ProductFieldArray couponFor={values.product_list_type} />}
        </>
    );
}