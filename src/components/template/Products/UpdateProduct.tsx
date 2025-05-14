import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../../hooks/UseFetch';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import MainDataProducts from './MainData';
import * as Yup from 'yup';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { isArabic, isEnglish } from '../../../helper/helpers';

export default function UpdateProduct() {
    const { t, i18n } = useTranslation();

    const { id } = useParams();
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.products.title'), to: '/products/index' },
        { label: t('breadcrumb.products.edit') },
    ];
    const [formKey, setFormKey] = useState(0);

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch,
    } = useFetch<any>({
        endpoint: `products/${id}`,
        queryKey: [`products/${id}`],
    });

    useEffect(() => {
        if (showDataSuccess) {
            setFormKey((prevKey) => prevKey + 1); // Ensure Formik re-initializes
        }
    }, [showData]);

    const initialValues = {
        main_image: showData?.data?.main_image?.media || '',
        size_guide: showData?.data?.size_guide?.media || '',

        ar_title: showData?.data?.ar?.title || '',
        en_title: showData?.data?.en?.title || '',

        ar_short_desc: showData?.data?.ar?.short_desc || '',
        en_short_desc: showData?.data?.en?.short_desc || '',

        ar_long_desc: showData?.data?.ar?.long_desc || '',
        en_long_desc: showData?.data?.en?.long_desc || '',

        main_category_id: showData?.data?.main_category?.id || '',
        sub_category_id: showData?.data?.sub_category?.id || '',
        sub_sub_category_id: showData?.data?.sub_sub_category?.id || '',
        brand_id: showData?.data?.brand?.id || '',

        is_trendy: showData?.data?.is_trendy === false ? 0 : 1 || 1,
        complete_outfits:
            showData?.data?.complete_outfits?.map((item: any) => item.product_id) || [],

        product_details:
            showData?.data?.details?.map((detail: any) => ({
                product_detail_id: detail?.id || '',
                size_id: detail?.size?.id || '',
                color_id: detail?.color?.id || '',
                price: detail?.price || '',
                quantity: detail?.quantity || '',
                sku: detail?.sku || '',
                is_default: detail?.is_default === false ? 0 : 1 || 1,

                videos:
                    detail?.videos?.length > 0
                        ? detail?.videos.map((video: any) => ({
                              id: video?.id,
                              media: video?.media, // Correct video URL
                          }))
                        : [],

                images:
                    detail?.images?.map((image: any) => ({
                        id: image?.id,
                        image: image?.media,
                    })) || [],
            })) || [],
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

            sub_category_id: Yup.string().required(
                t('requiredField', { field: t('labels.sub_category') })
            ),

            sub_sub_category_id: Yup.string().required(
                t('requiredField', { field: t('labels.sub_subCategories') })
            ),

            brand_id: Yup.string().required(t('requiredField', { field: t('labels.brands') })),

            is_trendy: Yup.string().required(t('requiredField', { field: t('labels.is_trendy') })),

            // complete_outfits: Yup.array()
            //     .min(1, t('requiredField', { field: t('labels.complete_outfits') }))
            //     .required(t('requiredField', { field: t('labels.complete_outfits') })),
        });

    // update data
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`products/${id}`],
        endpoint: `products/${id}`,

        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isEditSuccessfully', { name: t('breadcrumb.products.title') }),
            });

            refetch();
            navigate('/products/index');
            // refetch().then(() => {
            //     setFormKey(formKey + 1);
            // });
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
        const formattedCompleteOutfitsIds: any = {};

        values?.complete_outfits?.forEach((id: number, index: number) => {
            formattedCompleteOutfitsIds[`complete_outfits[${index}][complete_product_id]`] = id;
        });

        const productDetails = values.product_details.map((detail: any, detailIndex: number) => {
            const detailImages: any = {};
            const detailVideos: any = {};

            // Handle images
            if (detail.images && detail.images.length > 0) {
                detail.images.forEach((image: any, imgIndex: number) => {
                    if (typeof image !== 'number') {
                        // Only add non-number images to the payload
                        detailImages[`product_details[${detailIndex}][images][${imgIndex}]`] =
                            image;
                    }
                });
            }

            // Handle videos
            if (detail.videos && detail.videos.length > 0) {
                detail.videos.forEach((video: any, vidIndex: number) => {
                    if (typeof video !== 'number') {
                        // Only add non-number videos to the payload
                        detailVideos[`product_details[${detailIndex}][videos][${vidIndex}]`] =
                            video;
                    }
                });
            }

            return {
                ...detailImages,
                ...detailVideos,
                [`product_details[${detailIndex}][product_detail_id]`]: detail.product_detail_id,
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

        // Remove the image if it hasn't changed from initial values
        if (initialValues?.main_image === finalOut.main_image) {
            delete finalOut.main_image;
        }

        // Remove the size_guide if it hasn't changed from initial values
        if (initialValues?.size_guide === finalOut.size_guide) {
            delete finalOut.size_guide;
        }

        // Remove undefined keys
        Object.keys(finalOut).forEach((key) => {
            if (finalOut[key] === undefined) {
                delete finalOut[key];
            }
        });

        update(
            { ...finalOut, _method: 'put' },
            {
                onSuccess: async () => {
                    await refetch();
                    setFormKey((prevKey) => prevKey + 1);
                    navigate('/products/index');
                },
            }
        );
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                key={formKey} // This forces re-render when key changes
                validationSchema={productSchema()}
                enableReinitialize={true} // Ensure Formik updates when initialValues change
                initialValues={initialValues}
                onSubmit={(values: any) => {
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
                            <MainDataProducts isLoading={showDataLoading} refetch={refetch} />
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
