import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import MainDataCountries from './MainData';
import * as Yup from 'yup';
import { isArabic, isEnglish } from '../../../helper/helpers';

export default function AddCountry() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.countries.title'), to: '/countries/index' },
        { label: t('breadcrumb.countries.add') },
    ];
    const [formKey, setFormKey] = useState(0);
    const initialValues = {
        image: '',
        ar_name: '',
        en_name: '',

        ar_slug: '',
        en_slug: '',

        ar_currency: '',
        en_currency: '',

        short_name: '',
        phone_code: '',
        phone_limit: '',
    };

    const countrySchema = () =>
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

            ar_currency: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.currency') + t('inArabic') }))
                .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value)),

            en_currency: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.currency') + t('inEnglish') }))
                .test('is-english', t('validations.englishText'), (value) => isEnglish(value)),

            phone_code: Yup.number().required(
                t('requiredField', { field: t('labels.phone_code') })
            ),

            short_name: Yup.string().required(
                t('requiredField', { field: t('labels.short_name') })
            ),

            phone_limit: Yup.number().required(
                t('requiredField', { field: t('labels.phone_limit') })
            ),
        });

    const { mutate, isLoading } = useMutate({
        mutationKey: ['country'],
        endpoint: `country`,
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isCreatedSuccessfully', { name: t('breadcrumb.countries.title') }),
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
            image: values?.image,
            phone_code: values?.phone_code,
            short_name: values?.short_name,
            phone_limit: values?.phone_limit,

            ar: {
                name: values?.ar_name,
                slug: values?.ar_slug,
                currency: values?.ar_currency,
            },
            en: {
                name: values?.en_name,
                slug: values?.en_slug,
                currency: values?.en_currency,
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
                validationSchema={countrySchema()}
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
                            <MainDataCountries />
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
