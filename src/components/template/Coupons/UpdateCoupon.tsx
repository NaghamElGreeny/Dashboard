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
    const [isLoading, setIsLoading] = useState(false);

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDatasSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `coupon/${id}`,
        queryKey: [`coupon/${id}`],
    });

    useEffect(() => {
        setFormKey(formKey + 1);
    }, [showDatasSuccess]);

    const initialValues = {
        code: showData?.data?.code || '',
        value: showData?.data?.value || '',

        max_limit: showData?.data?.max_limit || '',
        user_limit: showData?.data?.user_limit || '',

        start_date: showData?.data?.start_date || '',
        end_date: showData?.data?.end_date || '',

        start_time: showData?.data?.start_time || '',
        end_time: showData?.data?.end_time || '',
        type: showData?.data?.type || '',

        is_active: showData?.data?.is_active === false ? 0 : 1 || 1,
    };

    const couponsSchema = () =>
        Yup.object().shape({
            code: Yup.string()
                .trim()
                .min(6, t('minLengthField', { field: t('labels.code'), min: 6 })) // Enforces minimum length of 6 characters
                .required(t('requiredField', { field: t('labels.code') })),

            value: Yup.number()
                .required(t('requiredField', { field: t('labels.value') }))
                .min(0, t('minField', { field: t('labels.usage_limit'), min: 0 })),

            max_limit: Yup.number()
                .required(t('requiredField', { field: t('labels.max_limit') }))
                .min(0, t('minField', { field: t('labels.usage_limit'), min: 0 })),

            user_limit: Yup.number()
                .required(t('requiredField', { field: t('labels.usage_limit') }))
                .min(0, t('minField', { field: t('labels.usage_limit'), min: 0 }))
                .lessThan(Yup.ref('max_limit'), t('validations.usageLimitLessThanMaxLimit')),

            start_date: Yup.date().required(t('requiredField', { field: t('labels.start_date') })),
            end_date: Yup.date().required(t('requiredField', { field: t('labels.end_date') })),

            start_time: Yup.string().required(
                t('requiredField', { field: t('labels.start_time') })
            ),

            end_time: Yup.string().required(t('requiredField', { field: t('labels.end_time') })),
            type: Yup.string().required(t('requiredField', { field: t('labels.type') })),

            is_active: Yup.string().required(t('requiredField', { field: t('labels.status') })),
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
        const started_at = `${values.start_date} ${values.start_time}`;
        const ended_at = `${values.end_date} ${values.end_time}`;

        const finalOut = {
            code: values?.code,
            value: values?.value,
            max_limit: values?.max_limit,
            user_limit: values?.user_limit,
            type: values.type,
            is_active: values?.is_active == false ? 0 : 1,

            started_at,
            ended_at,
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
                validationSchema={couponsSchema()}
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
                                    loading={LoadingUpdate || isLoading}
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
