import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import MainDataSliders from './MainData';
import * as Yup from 'yup';
import { isArabic, isEnglish } from '../../../helper/helpers';

export default function AddSlider() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.sliders.title'), to: '/sliders/index' },
        { label: t('breadcrumb.sliders.add') },
    ];
    const [formKey, setFormKey] = useState(0);
    const initialValues = {
        image: '',
        ar_name: '',
        en_name: '',
        ar_description: '',
        en_description: '',
        ordering: '',
        is_active: '',
        slider_type: '',
        main_category_id: '',
        products: [
            {
                product_id: '',
                product_detail_id: '',
            },
        ],
    };

    const sliderSchema = () =>
        Yup.object().shape({
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
            slider_type: Yup.string().required(
                t('requiredField', { field: t('labels.slider_type') })
            ),

            main_category_id: Yup.string().required(
                t('requiredField', { field: t('labels.main_category') })
            ),

            // products: Yup.array().of(
            //     Yup.object().shape({
            //         product_id: Yup.string().required(
            //             t('requiredField', { field: t('labels.product') })
            //         ),
            //         product_detail_id: Yup.string().required(
            //             t('requiredField', { field: t('labels.product_detail') })
            //         ),
            //     })
            // ),
        });

    const { mutate, isLoading } = useMutate({
        mutationKey: ['slider'],
        endpoint: `slider`,
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isCreatedSuccessfully', { name: t('breadcrumb.sliders.title') }),
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
        });

        const finalOut = {
            image: values?.image,
            ordering: values?.ordering,
            slider_type: values?.slider_type,
            main_category_id: values?.main_category_id,
            ar: {
                name: values?.ar_name,
                desc: values?.ar_description,
            },
            en: {
                name: values?.en_name,
                desc: values?.en_description,
            },
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
                validationSchema={sliderSchema()}
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
                            <MainDataSliders />
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
