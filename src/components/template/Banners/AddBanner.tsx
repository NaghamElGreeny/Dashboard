import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import * as Yup from 'yup';
import { isArabic, isEnglish } from '../../../helper/helpers';
import BannersMainData from './MainData';
import { features } from 'process';

export default function AddBanner() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.banners.title'), to: '/banners/index' },
        { label: t('breadcrumb.banners.add') },
    ];
    const [formKey, setFormKey] = useState(0);
    const initialValues = {
        ar_title: '',
        ar_description: '',

        en_title: '',
        en_description: '',
        type: '',
        image: '',
        icon: null,
        features: [],
    };
    const sectionsSchema = () =>
        Yup.object().shape({

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
            image: Yup.mixed().required(t('validation.image_only')),
            //feature


        });

    const { mutate, isLoading } = useMutate({
        mutationKey: ['sections'],
        endpoint: `sections`,
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isCreatedSuccessfully', { name: t('breadcrumb.socials.title') }),
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
            is_active: 0,
            image: values.image,
            icon: null, features: []
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
                validationSchema={sectionsSchema()}
                key={formKey}
                initialValues={initialValues}
                onSubmit={(values, actions) => {
                    handleSubmit(values, actions);
                }}
            >
                {({ values, errors }) => {

                    console.log(errors);


                    return (<Form>
                        <BannersMainData />
                        <div className="mt-10 mb-4 flex gap-2 justify-center">
                            <Button
                                type="submit"
                                className="bg-primary text-white py-3 px-5 rounded-lg hover:bg-white hover:text-primary border hover:border-primary"
                                loading={isLoading}
                            >
                                {t('buttons.save')}
                            </Button>
                        </div>
                    </Form>)
                }
                }
            </Formik>
        </div>
    );
}
