import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../../hooks/UseFetch';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import MainDataCities from './MainData';
import * as Yup from 'yup';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { isArabic, isEnglish } from '../../../helper/helpers';

export default function UpdateCity() {
    const { t, i18n } = useTranslation();

    const { id } = useParams();
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.cities.title'), to: '/cities/index' },
        { label: t('breadcrumb.cities.edit') },
    ];
    const [formKey, setFormKey] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showCitiesSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `city/${id}`,
        queryKey: [`city/${id}`],
    });

    useEffect(() => {
        setFormKey(formKey + 1);
    }, [showCitiesSuccess]);

    const initialValues = {
        image: showData?.data?.image || '',

        ar_name: showData?.data?.ar?.name || '',
        en_name: showData?.data?.en?.name || '',

        ar_slug: showData?.data?.ar?.slug || '',
        en_slug: showData?.data?.en?.slug || '',
        postal_code: showData?.data?.postal_code || '',
        short_cut: showData?.data?.short_cut || '',
        location: showData?.data?.location_data?.location || '',

        country_id: showData?.data?.country?.id || '',
        offline_session_availability:
            showData?.data?.offline_session_availability === false ? 0 : 1 || 1,

        lat: showData?.data?.location_data?.lat || '21.420001868436646',
        lng: showData?.data?.location_data?.lng || '39.8107274369873',
    };

    const citySchema = () =>
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

            ar_slug: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.slug') + t('inArabic') }))
                .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value))
                .matches(/^[^\s]*$/, t('validations.noSpacesAllowed')),

            en_slug: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.slug') + t('inEnglish') }))
                .test('is-english', t('validations.englishText'), (value) => isEnglish(value))
                .matches(/^[^\s]*$/, t('validations.noSpacesAllowed')),

            postal_code: Yup.string()
                .matches(/^\d{5}$/, t('validations.invalidPostalCode', { length: 5 }))
                .required(t('requiredField', { field: t('labels.postal_code') })),

            short_cut: Yup.string().required(t('requiredField', { field: t('labels.short_cut') })),
            location: Yup.string().required(t('requiredField', { field: t('labels.location') })),
            country_id: Yup.string().required(t('requiredField', { field: t('labels.country') })),

            offline_session_availability: Yup.string().required(
                t('requiredField', { field: t('labels.offline_session_availability') })
            ),
        });

    // update data
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`city/${id}`],
        endpoint: `city/${id}`,

        onSuccess: (data: any) => {
            // notify('success');
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isEditSuccessfully', { name: t('breadcrumb.cities.title') }),
            });

            refetch();
            navigate('/cities/index');
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
        const finalOut = {
            ar: {
                name: values?.ar_name,
                slug: values?.ar_slug,
            },
            en: {
                name: values?.en_name,
                slug: values?.en_slug,
            },
            image: values?.image,
            country_id: values?.country_id,
            postal_code: values?.postal_code,
            short_cut: values?.short_cut,

            offline_session_availability: values?.offline_session_availability == false ? 0 : 1,

            location_data: {
                location: values?.location,
                lat: values?.lat,
                lng: values?.lng,
            },
        };

        if (initialValues?.image == finalOut.image) {
            delete finalOut.image;
        }

        update({ ...finalOut });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                validationSchema={citySchema()}
                key={formKey}
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
                            <MainDataCities isLoading={showDataLoading} />
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
