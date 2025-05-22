import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../../hooks/UseFetch';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import SectionsMainData from './MainData';
import * as Yup from 'yup';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { isArabic, isEnglish } from '../../../helper/helpers';

import { Feature } from '../../../pages/Sections/types';

export default function UpdateFeature() {
    const { t, i18n } = useTranslation();

    const { id } = useParams();
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.sections.title'), to: '/sections/index' },
        { label: t('breadcrumb.sections.edit') },
    ];
    const [formKey, setFormKey] = useState(0);

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `sections/${id}`,
        queryKey: [`sections/${id}`],
    });
    useEffect(() => {
        setFormKey(formKey + 1);
    }, [showDataSuccess]);


    const feature = [{
        // id: '',
        icon: '',
        ar: { value: '' },
        en: { value: '' },

        key: '',
    }]
    const initialValues = {
        ar_title: showData?.data?.ar?.title || '',
        ar_description: showData?.data?.ar?.description || '',

        en_title: showData?.data?.en?.title || '',
        en_description: showData?.data?.en?.description || '',
        type: showData?.data?.type || '',
        image: showData?.data?.image?.url || '',

        icon: showData?.data?.icon?.url || '',

        features: showData?.data?.features?.length ? showData.data.features.map((f: Feature, index: number) => ({
            icon: f.icon.url,
            key: `key${index}`,
            ar: { value: f.ar.value || '' },
            en: { value: f.en.value || '' },
        })) : feature,


    };

    // console.log('initialValues of features: ', initialValues.features)
    const sectionsSchema = () =>
        Yup.object().shape({
            icon: Yup.mixed().required(t('requiredField', { field: t('labels.icon') })),
            ar_title: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.title') + t('inArabic') }))
                .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value)),

            en_title: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.title') + t('inEnglish') }))
                .test('is-english', t('validations.englishText'), (value) => isEnglish(value)),

            en_description: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.description') + t('inEnglish') })),
            ar_description: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.description') + t('inArabic') })),
            type: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.type') })),

            image: Yup.mixed().required(t('requiredField', { field: t('labels.image') })),
            //features
            features: Yup.array().of(
                Yup.object().shape({
                    icon: Yup.string().required(t('requiredField', { field: t('labels.icon') })),
                    ar: Yup.object().shape({
                        value: Yup.string().required(t('requiredField', { field: t('labels.title') + t('inArabic') })),
                    }),
                    en: Yup.object().shape({
                        value: Yup.string().required(t('requiredField', { field: t('labels.title') + t('inEnglish') })),
                    }),
                }))

        });

    // update data
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`sections/${id}`],
        endpoint: `sections/${id}`,

        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isEditSuccessfully', { name: t('breadcrumb.features.title') }),
            });

            // notify('success');
            refetch();
            navigate('/sections/index');
        },
        onError: (err: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'error',
                title: err?.response?.data?.message,
            });
        },

        formData: true,
        // method: 'post',
    });

    const handleSubmit = (values: any) => {
        console.log(values);

        const finalOut = {
            ar: {
                title: values?.ar_title,
                description: values?.ar_description,
            },
            en: {
                title: values?.en_title,
                description: values?.en_description,
            },
            type: values?.type,
            icon: values.icon,
            image: values.image,
            features: values.features?.map((f: Feature, index: number) => {
                const initialIcon = initialValues.features?.[index]?.icon !== f.icon && f.icon;


                return {
                    ...(initialIcon && { icon: initialIcon }),
                    key: `key${index}`,
                    ar: { value: f.ar?.value || '' },
                    en: { value: f.en?.value || '' },
                };
            }),

        };


        if (initialValues?.image == finalOut.image) {
            delete finalOut.image;
        }
        if (initialValues?.icon == finalOut.icon) {
            delete finalOut.icon;
        }
        update({
            ...finalOut,
            // _method: 'put'
            _method: 'post'
        });

    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                validationSchema={sectionsSchema()}
                key={formKey}
                initialValues={initialValues}
                enableReinitialize
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
                            <SectionsMainData isLoading={showDataLoading} data={showData} />
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
