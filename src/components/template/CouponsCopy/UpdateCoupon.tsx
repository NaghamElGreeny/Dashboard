import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../../hooks/UseFetch';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import MainDataCoupons from './MainData';
import * as Yup from 'yup';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';

export default function UpdateCoupon() {
    const { t, i18n } = useTranslation();

    const { id } = useParams();
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.coupons.title'), to: '/coupons/index' },
        { label: t('breadcrumb.coupons.edit') },
    ];
    const [formKey, setFormKey] = useState(0);

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `coupon/${id}`,
        queryKey: [`coupon/${id}`],
    });

    useEffect(() => {
        setFormKey(formKey + 1);
    }, [showDataSuccess]);

    const initialValues = {
        type: showData?.data?.type || '',
        code: showData?.data?.code || '',
        discount_type: showData?.data?.discount_type || '',
        discount: showData?.data?.discount || '',

        max_discount: showData?.data?.max_discount || '',
        max_used_num: showData?.data?.max_used_num || '',

        max_used_for_user: showData?.data?.max_used_for_user || '',
        min_price: showData?.data?.min_price || '',

        end_date: showData?.data?.end_at || '',
        start_date: showData?.data?.start_at || '',

        start_time: showData?.data?.start_time || '',
        end_time: showData?.data?.end_time || '',
        product_list_type: showData?.data?.product_list_type || '',

        is_active: showData?.data?.is_active === false ? 0 : 1 || 1,

        products:
            showData?.data?.product_coupons?.map((item: any) => ({
                product_id: item?.product_id || '',
                product_detail_id: item?.product_detail_id || '',
            })) || [],
    };

    const couponSchema = () =>
        Yup.object().shape({
            type: Yup.string().required(t('requiredField', { field: t('labels.type') })),

            code: Yup.string()
                .trim()
                .when('type', {
                    is: 'coupon',
                    then: (schema) =>
                        schema
                            .min(6, t('minLengthField', { field: t('labels.code'), min: 6 }))
                            .required(t('requiredField', { field: t('labels.code') })),
                    otherwise: (schema) => schema.notRequired(),
                }),

            discount_type: Yup.string().when('type', {
                is: 'coupon',
                then: (schema) =>
                    schema.required(t('requiredField', { field: t('labels.discount_type') })),
                otherwise: (schema) => schema.notRequired(),
            }),

            discount: Yup.number().when('type', {
                is: 'coupon',
                then: (schema) =>
                    schema
                        .required(t('requiredField', { field: t('labels.discount') }))
                        .min(0, t('minField', { field: t('labels.discount'), min: 0 })),
                otherwise: (schema) => schema.notRequired(),
            }),

            max_discount: Yup.number().when('type', {
                is: 'coupon',
                then: (schema) =>
                    schema
                        .required(t('requiredField', { field: t('labels.max_discount') }))
                        .min(0, t('minField', { field: t('labels.max_discount'), min: 0 })),
                otherwise: (schema) => schema.notRequired(),
            }),

            min_price: Yup.number().when('type', {
                is: 'free_shipping',
                then: (schema) =>
                    schema
                        .required(t('requiredField', { field: t('labels.min_price') }))
                        .min(0, t('minField', { field: t('labels.min_price'), min: 0 })),
                otherwise: (schema) => schema.notRequired(),
            }),

            max_used_num: Yup.number()
                .required(t('requiredField', { field: t('labels.max_limit') }))
                .min(0, t('minField', { field: t('labels.max_limit'), min: 0 })),

            max_used_for_user: Yup.number()
                .required(t('requiredField', { field: t('labels.usage_limit') }))
                .min(0, t('minField', { field: t('labels.usage_limit'), min: 0 }))
                .lessThan(Yup.ref('max_used_num'), t('validations.usageLimitLessThanMaxLimit')),

            start_date: Yup.date().required(t('requiredField', { field: t('labels.start_date') })),
            end_date: Yup.date().required(t('requiredField', { field: t('labels.end_date') })),

            start_time: Yup.string().required(
                t('requiredField', { field: t('labels.start_time') })
            ),

            end_time: Yup.string().required(t('requiredField', { field: t('labels.end_time') })),

            is_active: Yup.string().required(t('requiredField', { field: t('labels.status') })),

            product_list_type: Yup.string().when('type', {
                is: 'coupon',
                then: (schema) =>
                    schema.required(t('requiredField', { field: t('labels.coupon_for') })),
                otherwise: (schema) => schema.notRequired(),
            }),
        });

    // update data
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`coupon/${id}`],
        endpoint: `coupon/${id}`,

        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isEditSuccessfully', { name: t('breadcrumb.coupons.title') }),
            });

            refetch();
            navigate('/coupons/index');
        },
        onError: (err: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'error',
                title: err?.response?.data?.message,
            });
        },

        formData: true,
    });

    const handleSubmit = (values: any) => {
        const start_at = `${values.start_date} ${values.start_time}`;
        const end_at = `${values.end_date} ${values.end_time}`;

        const finalOut = {
            type: values?.type,
            code: values?.code,
            discount_type: values?.discount_type,
            max_discount: values?.max_discount,
            discount: values?.discount,
            max_used_num: values?.max_used_num,
            max_used_for_user: values?.max_used_for_user,
            min_price: values?.min_price,
            product_list_type: values?.product_list_type,
            is_active: values?.is_active == false ? 0 : 1,

            start_at,
            end_at,
        };

        if (initialValues?.code == finalOut?.code) {
            delete finalOut?.code;
        }
        update({ ...finalOut });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                validationSchema={couponSchema()}
                key={formKey}
                initialValues={initialValues}
                onSubmit={(values: any) => {
                    //@ts-ignore
                    handleSubmit(values);
                }}
            >
                {({ validateForm }) => {
                    // Listen for language changes and revalidate
                    useEffect(() => {
                        validateForm();
                    }, [i18n.language]);

                    return (
                        <Form>
                            <MainDataCoupons isLoading={showDataLoading} />
                            <div className="mt-10 mb-4 flex gap-2 justify-center">
                                <Button
                                    type="submit"
                                    className="bg-primary text-white py-3 px-5 rounded-lg hover:bg-white hover:text-primary border hover:border-primary"
                                    loading={LoadingUpdate}
                                >
                                    {t('buttons.save')}
                                </Button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}
