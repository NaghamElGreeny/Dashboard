import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import MainDataCoupons from './MainData';
import * as Yup from 'yup';

export default function AddCoupon() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.coupons.title'), to: '/coupons/index' },
        { label: t('breadcrumb.coupons.add') },
    ];
    const [formKey, setFormKey] = useState(0);
    const initialValues = {
        code: '',
        value: '',
        max_limit: '',
        user_limit: '',

        start_date: '',
        end_date: '',

        start_time: '',
        end_time: '',

        is_active: '',
        type: '',
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

    const { mutate, isLoading } = useMutate({
        mutationKey: ['coupon'],
        endpoint: `coupon`,
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isCreatedSuccessfully', { name: t('breadcrumb.coupons.title') }),
            });

            setFormKey(formKey + 1);
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

    const handleSubmit = (values: any, actions: any) => {
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

        mutate(finalOut, {
            onSuccess: () => {
                // Reset the form to initial values
                actions.setSubmitting(false);
            },
        });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                validationSchema={couponsSchema()}
                key={formKey}
                initialValues={initialValues}
                onSubmit={(values, actions) => {
                    handleSubmit(values, actions);
                }}
            >
                {({ validateForm }) => {
                    // Listen for language changes and revalidate
                    useEffect(() => {
                        validateForm();
                    }, [i18n.language]);

                    return (
                        <Form>
                            <MainDataCoupons />
                            <div className="mt-10 mb-4 flex gap-2 justify-center">
                                <Button
                                    type="submit"
                                    className="bg-primary text-white py-3 px-5 rounded-lg hover:bg-white hover:text-primary border hover:border-primary"
                                    loading={isLoading}
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
