import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../../hooks/UseFetch';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import * as Yup from 'yup';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import MainDataOffer from './MainData';

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
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `offers/${id}`,
        queryKey: [`offers/${id}`],
    });

    useEffect(() => {
        setFormKey(formKey + 1);
    }, [showDataSuccess]);

    const [productUpdates, setProductUpdates] = useState<{ [key: string]: any }>({});

    const initialValues = {
        type: showData?.data?.type || '',
        discount: showData?.data?.discount || '',
        start_at: showData?.data?.start_at || '',
        end_at: showData?.data?.end_at || '',
        is_active: showData?.data?.is_active === false ? 0 : 1 || 1,

        products:
            showData?.data?.products?.map((item: any) => ({
                product_id: item?.product_id || '',
                product_detail_id:
                    productUpdates[item?.product_id]?.detail_id ?? (item?.product_detail || ''),
                discount: productUpdates[item?.product_id]?.discount ?? (item?.discount || ''),
            })) || [],
    };

    // const initialValues = {
    //     type: showData?.data?.type || '',
    //     discount: showData?.data?.discount || '',
    //     start_at: showData?.data?.start_at || '',
    //     end_at: showData?.data?.end_at || '',
    //     is_active: showData?.data?.is_active === false ? 0 : 1 || 1,

    //     products:
    //         showData?.data?.products?.map((item: any) => ({
    //             product_id: item?.product_id || '',
    //             // price_before_discount: item?.price_before_discount || '',
    //             // price_after_discount: item?.price_after_discount || '',
    //             product_detail_id:
    //                 productUpdates[item?.product_id]?.detail_id || item?.product_detail || '',
    //             discount: productUpdates[item?.product_id]?.discount ?? (item?.discount || ''),
    //         })) || [],
    // };

    const offersSchema = () =>
        Yup.object().shape({
            type: Yup.string().required(t('requiredField', { field: t('labels.type') })),
            start_at: Yup.date().required(t('requiredField', { field: t('labels.start_date') })),
            end_at: Yup.date().required(t('requiredField', { field: t('labels.end_date') })),
            is_active: Yup.string().required(t('requiredField', { field: t('labels.status') })),
        });

    // update data
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

    const formatProductsForSubmission = (products: any) => {
        const formattedProducts: any = {};

        products.forEach((product: any, index: number) => {
            formattedProducts[`products[${index}][product_detail_id]`] = product.product_detail_id;
            formattedProducts[`products[${index}][discount]`] = product.discount;
        });

        return formattedProducts;
    };

    const handleSubmit = (values: any) => {
        const { products, ...restValues } = values;

        const formattedValues = {
            ...restValues,
            ...formatProductsForSubmission(products),
        };

        update({
            ...formattedValues,
            _method: 'put',
        });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                validationSchema={offersSchema()}
                key={formKey}
                enableReinitialize={showDataSuccess} // Only enable on first load
                initialValues={initialValues}
                onSubmit={(values: any) => {
                    handleSubmit(values);
                }}
            >
                {/* <Formik
                validationSchema={offersSchema()}
                key={formKey}
                enableReinitialize // Ensures form state updates correctly
                initialValues={initialValues}
                onSubmit={(values: any) => {
                    handleSubmit(values);
                }}
            > */}
                <Form>
                    <MainDataOffer
                        isLoading={showDataLoading}
                        onChangeProductId={(e: any) => {
                            setProductUpdates((prev) => ({
                                ...prev,
                                [e.product_id]: {
                                    detail_id: e.detail_id,
                                    discount: e.discount,
                                },
                            }));
                        }}
                        initialProductIds={
                            showData?.data?.products?.map((item: any) => ({
                                product_id: item.product_id,
                                discount:
                                    productUpdates[item.product_id]?.discount ?? item.discount,
                                product_detail_id:
                                    productUpdates[item.product_id]?.detail_id ??
                                    item.product_detail,
                            })) || []
                        }
                    />

                    {/* <MainDataOffer
                        isLoading={showDataLoading}
                        onChangeProductId={(e: any) => {
                            setProductUpdates((prev) => ({
                                ...prev,
                                [e.product_id]: {
                                    detail_id: e.detail_id,
                                    discount: e.discount,
                                },
                            }));
                        }}
                        initialProductIds={
                            showData?.data?.products?.map((item: any) => ({
                                product_id: item.product_id,
                                discount:
                                    productUpdates[item.product_id]?.discount ?? item.discount,
                                product_detail_id:
                                    productUpdates[item.product_id]?.detail_id ??
                                    item.product_detail,
                            })) || []
                        }
                    /> */}
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
            </Formik>
        </div>
    );
}
