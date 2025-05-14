import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../../hooks/UseFetch';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import MainDataCountries from './MainData';
import * as Yup from 'yup';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { isArabic, isEnglish } from '../../../helper/helpers';

export default function UpdateCountry() {
    const { t, i18n } = useTranslation();

    const { id } = useParams();
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.countries.title'), to: '/countries/index' },
        { label: t('breadcrumb.countries.edit') },
    ];
    const [formKey, setFormKey] = useState(0);

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `country/${id}`,
        queryKey: [`country/${id}`],
    });

    useEffect(() => {
        setFormKey(formKey + 1);
    }, [showDataSuccess]);

    const initialValues = {
        image: showData?.data?.image || '',

        ar_name: showData?.data?.ar?.name || '',
        en_name: showData?.data?.en?.name || '',

        ar_slug: showData?.data?.ar?.slug || '',
        en_slug: showData?.data?.en?.slug || '',

        ar_currency: showData?.data?.ar?.currency || '',
        en_currency: showData?.data?.en?.currency || '',

        phone_code: showData?.data?.phone_code || '',
        short_name: showData?.data?.short_name || '',
        phone_limit: showData?.data?.phone_limit || '',
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

    // update data
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`country/${id}`],
        endpoint: `country/${id}`,

        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isEditSuccessfully', { name: t('breadcrumb.countries.title') }),
            });

            // notify('success');
            refetch();
            navigate('/countries/index');
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

        if (initialValues?.image == finalOut.image) {
            delete finalOut.image;
        }

        update({ ...finalOut });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                validationSchema={countrySchema()}
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
                            <MainDataCountries isLoading={showDataLoading} />
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
