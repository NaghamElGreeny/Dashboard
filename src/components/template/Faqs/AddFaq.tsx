import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import FaqMainData from './MainData';
import * as Yup from 'yup';
import { isArabic, isEnglish } from '../../../helper/helpers';

export default function AddFaq() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.faqs.title'), to: '/faq/index' },
        { label: t('breadcrumb.faqs.add') },
    ];
    const [formKey, setFormKey] = useState(0);
    const initialValues = {
        ar_question: '',
        ar_answer: '',

        en_question: '',
        en_answer: '',
        is_active: false

    };

    const faqSchema = () =>
        Yup.object().shape({
            ar_question: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.question') + t('inArabic') }))
                .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value)),

            en_question: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.question') + t('inEnglish') }))
                .test('is-english', t('validations.englishText'), (value) => isEnglish(value)),

            en_answer: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.answer') + t('inEnglish') })),
            ar_answer: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.answer') + t('inArabic') })),
            is_active: Yup.boolean()
                .required(t('requiredField', { field: t('labels.status') })),
        });
    console.log(initialValues)

    const { mutate, isLoading } = useMutate({
        mutationKey: ['faq'],
        endpoint: `faq`,
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isCreatedSuccessfully', { name: t('breadcrumb.faqs.title') }),
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
                question: values?.ar_question,
                answer: values?.ar_answer,
            },
            en: {
                question: values?.en_question,
                answer: values?.en_answer,
            },
            is_active: values?.is_active ? 1 : 0
        };
        console.log(finalOut)
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
                validationSchema={faqSchema()}
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
                            <FaqMainData />
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
