import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import MainDataOffer from './MainData';
import * as Yup from 'yup';

export default function AddOffer() {
    const { t } = useTranslation();

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
                product_id: '',
                product_detail_id: '',
                discount: '',
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

    // Convert products array to indexed format for submission
    const formatProductsForSubmission = (products: any) => {
        const formattedProducts: any = {};

        products.forEach((product: any, index: number) => {
            formattedProducts[`products[${index}][product_detail_id]`] = product.product_detail_id;
            formattedProducts[`products[${index}][discount]`] = product.discount;
        });

        return formattedProducts;
    };

    const handleSubmit = (values: any, actions: any) => {
        const { products, ...restValues } = values;

        const formattedValues = {
            ...restValues,
            ...formatProductsForSubmission(products),
        };

        mutate(formattedValues, {
            onSuccess: () => {
                actions.setSubmitting(false);
            },
        });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                // validationSchema={offersSchema()}
                key={formKey}
                initialValues={initialValues}
                onSubmit={(values, actions) => {
                    handleSubmit(values, actions);
                }}
            >
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
            </Formik>
        </div>
    );
}
