import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import useFetch from '../../../hooks/UseFetch';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import MainDataOffers from './MainData';

export default function UpdateOffer() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.offers.title'), to: '/offers' },
        { label: t('breadcrumb.offers.edit') },
    ];

    const [formKey, setFormKey] = useState(0);

    const {
        data: showData,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch,
    } = useFetch<any>({
        endpoint: `offers/${id}`,
        queryKey: [`offers/${id}`],
    });

    useEffect(() => {
        if (showDataSuccess) {
            setFormKey((prev) => prev + 1); // Ensure Formik reinitializes on data fetch
        }
    }, [showDataSuccess]);

    const initialValues = {
        type: showData?.data?.type || '',
        discount: showData?.data?.discount || '',
        start_at: showData?.data?.start_at || '',
        end_at: showData?.data?.end_at || '',
        is_active: showData?.data?.is_active === false ? 0 : 1 || 1,

        // Ensure product structure is correct
        products:
            showData?.data?.products?.map((item: any) => ({
                discount: item?.discount || '',
                product_id: item?.product_id || '',
                product_detail_id: item?.product_detail || '',
            })) || [],
    };

    const offersSchema = () =>
        Yup.object().shape({
            type: Yup.string().required(t('requiredField', { field: t('labels.type') })),
            start_at: Yup.date().required(t('requiredField', { field: t('labels.start_date') })),
            end_at: Yup.date().required(t('requiredField', { field: t('labels.end_date') })),
            is_active: Yup.string().required(t('requiredField', { field: t('labels.status') })),
        });

    // Update mutation
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`offers/${id}`],
        endpoint: `offers/${id}`,
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isEditSuccessfully', { name: t('breadcrumb.offers.title') }),
            });
            refetch();
            // navigate('/offers');
            if (window.history.state && window.history.state.idx > 0) {
                navigate(-1);
            } else {
                navigate('/offers');
            }
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

        update({ ...finalOut, _method: 'put' });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            <Formik
                validationSchema={offersSchema}
                key={formKey} // Ensures Formik resets on data change
                enableReinitialize
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                {({ validateForm }) => {
                    useEffect(() => {
                        validateForm();
                    }, [t]);

                    return (
                        <Form>
                            <MainDataOffers isLoading={showDataLoading} />
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
