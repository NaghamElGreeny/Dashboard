import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import MainDataCities from './MainData';
import * as Yup from 'yup';
import { isArabic, isEnglish } from '../../../helper/helpers';

export default function AddCity() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.cities.title'), to: '/cities/index' },
        { label: t('breadcrumb.cities.add') },
    ];
    const [formKey, setFormKey] = useState(0);
    const initialValues = {
        image: '',
        ar_name: '',
        en_name: '',
        ar_slug: '',
        en_slug: '',
        postal_code: '',
        short_cut: '',
        location: '',
        country_id: '',
        offline_session_availability: '',
        lat: '21.420001868436646',
        lng: '39.8107274369873',
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

    const { mutate, isLoading } = useMutate({
        mutationKey: ['city'],
        endpoint: `city`,
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isCreatedSuccessfully', { name: t('breadcrumb.cities.title') }),
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
                validationSchema={citySchema()}
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
                            <MainDataCities />
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
