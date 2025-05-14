import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import MainDataOffer from './MainData';

export default function AddOffer() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.offers.title'), to: '/offers' },
        { label: t('breadcrumb.offers.add') },
    ];
    const [formKey, setFormKey] = useState(0);
    const initialValues = {
        type: '',
        start_at: '',
        end_at: '',
        is_active: '',
        products: [
            {
                discount: '',
                product_id: '',
                product_detail_id: '',
            },
        ],
    };

    const offersSchema = () =>
        Yup.object().shape({
            type: Yup.string().required(t('requiredField', { field: t('labels.type') })),
            start_at: Yup.date().required(t('requiredField', { field: t('labels.start_date') })),
            end_at: Yup.date().required(t('requiredField', { field: t('labels.end_date') })),
            is_active: Yup.string().required(t('requiredField', { field: t('labels.status') })),
        });

    const { mutate, isLoading } = useMutate({
        mutationKey: ['offers'],
        endpoint: `offers`,
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isCreatedSuccessfully', { name: t('breadcrumb.offers.title') }),
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
        // Format products array for submission
        const formattedProducts: any = {};
        values.products.forEach((product: any, index: number) => {
            // formattedProducts[`products[${index}][product_id]`] = product.product_id;
            formattedProducts[`products[${index}][product_detail_id]`] = product.product_detail_id;
            formattedProducts[`products[${index}][discount]`] = product.discount;
        });

        const finalOut = {
            type: values?.type,
            start_at: values?.start_at,
            end_at: values?.end_at,
            is_active: values?.is_active == false ? 0 : 1,
            ...formattedProducts,
        };

        mutate(finalOut, {
            onSuccess: () => {
                actions.setSubmitting(false);
            },
        });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                validationSchema={offersSchema()}
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
                            <MainDataOffer />
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
