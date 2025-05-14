import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import MainDataProducts from './MainData';
import * as Yup from 'yup';
import { isArabic, isEnglish } from '../../../helper/helpers';

export default function AddProduct() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.products.title'), to: '/products/index' },
        { label: t('breadcrumb.products.add') },
    ];
    const [formKey, setFormKey] = useState(0);
    const initialValues = {
        main_image: '',
        size_guide: '',

        ar_title: '',
        en_title: '',

        ar_short_desc: '',
        en_short_desc: '',

        ar_long_desc: '',
        en_long_desc: '',

        main_category_id: '',
        sub_category_id: '',
        sub_sub_category_id: '',
        brand_id: '',

        is_trendy: '',

        complete_outfits: [],

        product_details: [
            {
                images: [
                    {
                        // id: Date.now(),
                        image: '',
                    },
                ],
                videos: [
                    {
                        // id: Date.now(),
                        image: '',
                    },
                ],

                size_id: '',
                color_id: '',
                price: '',
                quantity: '',
                sku: '',
                is_default: '',
            },
        ],
    };

    const productSchema = () =>
        Yup.object().shape({
            main_image: Yup.mixed().required(t('requiredField', { field: t('labels.main_image') })),
            size_guide: Yup.mixed().required(t('requiredField', { field: t('labels.size_guide') })),

            ar_title: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.title') + t('inArabic') })),

            en_title: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.title') + t('inEnglish') })),

            ar_short_desc: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.short_desc') + t('inArabic') })),

            en_short_desc: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.short_desc') + t('inEnglish') })),

            // ar_title: Yup.string()
            //     .trim()
            //     .required(t('requiredField', { field: t('labels.title') + t('inArabic') }))
            //     .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value)),

            // en_title: Yup.string()
            //     .trim()
            //     .required(t('requiredField', { field: t('labels.title') + t('inEnglish') }))
            //     .test('is-english', t('validations.englishText'), (value) => isEnglish(value)),

            // ar_short_desc: Yup.string()
            //     .trim()
            //     .required(t('requiredField', { field: t('labels.short_desc') + t('inArabic') }))
            //     .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value)),

            // en_short_desc: Yup.string()
            //     .trim()
            //     .required(t('requiredField', { field: t('labels.short_desc') + t('inEnglish') }))
            //     .test('is-english', t('validations.englishText'), (value) => isEnglish(value)),

            ar_long_desc: Yup.string().required(
                t('requiredField', { field: t('labels.long_desc') + t('inArabic') })
            ),
            en_long_desc: Yup.string().required(
                t('requiredField', { field: t('labels.long_desc') + t('inEnglish') })
            ),

            main_category_id: Yup.string().required(
                t('requiredField', { field: t('labels.main_category') })
            ),

            // sub_category_id: Yup.string().required(
            //     t('requiredField', { field: t('labels.sub_category') })
            // ),

            // sub_sub_category_id: Yup.string().required(
            //     t('requiredField', { field: t('labels.sub_subCategories') })
            // ),

            brand_id: Yup.string().required(t('requiredField', { field: t('labels.brands') })),

            is_trendy: Yup.string().required(t('requiredField', { field: t('labels.is_trendy') })),

            // complete_outfits: Yup.array()
            //     .min(1, t('requiredField', { field: t('labels.main_complete_outfits') }))
            //     .required(t('requiredField', { field: t('labels.main_complete_outfits') })),
        });

    const { mutate, isLoading } = useMutate({
        mutationKey: ['products'],
        endpoint: `products`,
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isCreatedSuccessfully', { name: t('breadcrumb.products.title') }),
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
        const formattedCompleteOutfitsIds: any = {};

        values?.complete_outfits?.forEach((id: number, index: number) => {
            formattedCompleteOutfitsIds[`complete_outfits[${index}][complete_product_id]`] = id;
        });

        const productDetails = values.product_details.map((detail: any, detailIndex: number) => {
            const detailImages: any = {};
            const detailVideos: any = {};

            // if (detail?.images && detail?.images?.length > 0) {
            //     detail?.images.forEach((img: any, imgIndex: number) => {
            //         console.log(img, 'image value');
            //         detailImages[`product_details[${detailIndex}][images][${imgIndex}]`] = img;
            //     });
            // }

            // // Handle videos
            // if (detail?.videos && detail?.videos?.length > 0) {
            //     detail?.videos?.forEach((vid: any, vidIndex: number) => {
            //         console.log(vid, 'video value');

            //         detailVideos[`product_details[${detailIndex}][videos][${vidIndex}]`] = vid;
            //     });
            // }

            // Handle images
            if (detail?.images && detail?.images?.length > 0) {
                detail?.images.forEach((img: any, imgIndex: number) => {
                    console.log(img, 'image value');

                    // Only add if image is not an empty string
                    if (img && img.image !== '') {
                        detailImages[`product_details[${detailIndex}][images][${imgIndex}]`] = img;
                    } else {
                        detailImages[`product_details[${detailIndex}][images][${imgIndex}]`] =
                            img.image;
                    }
                });
            }

            // Handle videos, but only include if not empty
            if (detail?.videos && detail?.videos?.length > 0) {
                detail?.videos?.forEach((vid: any, vidIndex: number) => {
                    console.log(vid, 'video value');

                    // Only add if video is not an empty string
                    if (vid && vid.image !== '') {
                        detailVideos[`product_details[${detailIndex}][videos][${vidIndex}]`] = vid;
                    } else {
                        detailVideos[`product_details[${detailIndex}][videos][${vidIndex}]`] =
                            vid.image;
                    }
                });
            }

            return {
                ...detailImages,
                ...detailVideos,
                [`product_details[${detailIndex}][size_id]`]: detail.size_id,
                [`product_details[${detailIndex}][color_id]`]: detail.color_id,
                [`product_details[${detailIndex}][price]`]: detail.price,
                [`product_details[${detailIndex}][quantity]`]: detail.quantity,
                [`product_details[${detailIndex}][sku]`]: detail.sku,
                [`product_details[${detailIndex}][is_default]`]: detail.is_default == 1 ? 1 : 0,
            };
        });

        const finalOut = {
            main_image: values?.main_image,
            size_guide: values?.size_guide,

            ar: {
                title: values?.ar_title,
                short_desc: values?.ar_short_desc,
                long_desc: values?.ar_long_desc,
            },
            en: {
                title: values?.en_title,
                short_desc: values?.en_short_desc,
                long_desc: values?.en_long_desc,
            },

            main_category_id: values?.main_category_id,
            sub_category_id: values?.sub_category_id,
            sub_sub_category_id: values?.sub_sub_category_id,
            brand_id: values?.brand_id,

            is_trendy: values?.is_trendy == false ? 0 : 1,
            ...formattedCompleteOutfitsIds,
            ...Object.assign({}, ...productDetails), // Merge all product details
        };

        // Remove undefined keys
        Object.keys(finalOut).forEach((key) => {
            if (finalOut[key] === undefined) {
                delete finalOut[key];
            }
        });

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
                validationSchema={productSchema()}
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
                            <MainDataProducts />
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
