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
import MainDataSliders from './MainData';
import { isArabic, isEnglish } from '../../../helper/helpers';

export default function UpdateSlider() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.sliders.title'), to: '/sliders/index' },
        { label: t('breadcrumb.sliders.edit') },
    ];

    const [formKey, setFormKey] = useState(0);

    const {
        data: showData,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch,
    } = useFetch<any>({
        endpoint: `slider/${id}`,
        queryKey: [`slider/${id}`],
    });

    useEffect(() => {
        if (showDataSuccess) {
            setFormKey((prev) => prev + 1); // Ensure Formik reinitializes on data fetch
        }
    }, [showDataSuccess]);

    const initialValues = {
        image: showData?.data?.image || '',
        ar_name: showData?.data?.ar?.name || '',
        en_name: showData?.data?.en?.name || '',
        ar_description: showData?.data?.ar?.desc || '',
        en_description: showData?.data?.en?.desc || '',
        ordering: showData?.data?.ordering || '',
        slider_type: showData?.data?.slider_type || '',
        main_category_id: showData?.data?.main_category?.id || '',
        is_active: showData?.data?.is_active === false ? 0 : 1,

        products:
            showData?.data?.product_sliders?.map((item: any) => ({
                product_id: item?.product_id || '',
                product_detail_id: item?.product_detail_id || '',
            })) || [],
    };

    const sliderSchema = Yup.object().shape({
        image: Yup.mixed().required(t('requiredField', { field: t('labels.image') })),
        ar_name: Yup.string()
            .trim()
            .required(t('requiredField', { field: t('labels.name') + t('inArabic') }))
            .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value)),
        en_name: Yup.string()
            .trim()
            .required(t('requiredField', { field: t('labels.name') + t('inEnglish') }))
            .test('is-english', t('validations.englishText'), (value) => isEnglish(value)),
        ar_description: Yup.string()
            .trim()
            .required(t('requiredField', { field: t('labels.description') + t('inArabic') }))
            .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value)),
        en_description: Yup.string()
            .trim()
            .required(t('requiredField', { field: t('labels.description') + t('inEnglish') }))
            .test('is-english', t('validations.englishText'), (value) => isEnglish(value)),
        is_active: Yup.string().required(t('requiredField', { field: t('labels.status') })),
        slider_type: Yup.string().required(t('requiredField', { field: t('labels.slider_type') })),
        main_category_id: Yup.string().required(
            t('requiredField', { field: t('labels.main_category') })
        ),
        products: Yup.array().of(
            Yup.object().shape({
                product_id: Yup.string().required(
                    t('requiredField', { field: t('labels.product') })
                ),
                product_detail_id: Yup.string().required(
                    t('requiredField', { field: t('labels.product_detail') })
                ),
            })
        ),
    });

    // Update mutation
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`slider/${id}`],
        endpoint: `slider/${id}`,
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isEditSuccessfully', { name: t('breadcrumb.sliders.title') }),
            });
            refetch();
            navigate('/sliders/index');
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
        return products.reduce((acc: any, product: any, index: number) => {
            acc[`products[${index}][product_id]`] = product.product_id;
            acc[`products[${index}][product_detail_id]`] = product.product_detail_id;
            return acc;
        }, {});
    };

    const handleSubmit = (values: any) => {
        const finalOut = {
            image: values.image,
            ordering: values.ordering,
            slider_type: values.slider_type,
            main_category_id: values.main_category_id,
            ar: {
                name: values.ar_name,
                desc: values.ar_description,
            },
            en: {
                name: values.en_name,
                desc: values.en_description,
            },
            is_active: values.is_active ? 1 : 0,
            ...formatProductsForSubmission(values.products),
        };

        if (initialValues.image === finalOut.image) {
            delete finalOut.image;
        }

        update({ ...finalOut, _method: 'put' });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            <Formik
                validationSchema={sliderSchema}
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
                            <MainDataSliders isLoading={showDataLoading} />
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
