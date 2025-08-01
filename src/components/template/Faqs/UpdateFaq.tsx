import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../../hooks/UseFetch';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import FaqMainData from './MainData';
import * as Yup from 'yup';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { isArabic, isEnglish } from '../../../helper/helpers';

export default function UpdateFaq() {
    const { t, i18n } = useTranslation();

    const { id } = useParams();
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.faqs.title'), to: '/faq/index' },
        { label: t('breadcrumb.faqs.edit') },
    ];
    const [formKey, setFormKey] = useState(0);

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `faq/${id}`,
        queryKey: [`faq/${id}`],
    });
    console.log(showData)
    console.log(id)
    useEffect(() => {
        setFormKey(formKey + 1);
    }, [showDataSuccess]);

    const initialValues = {
        ar_question: showData?.data?.ar?.question || '',
        ar_answer: showData?.data?.ar?.answer || '',

        en_question: showData?.data?.en?.question || '',
        en_answer: showData?.data?.en?.answer || '',
        is_active: Number(showData?.data?.is_active) || 0
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

    // update data
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`faq/${id}`],
        endpoint: `faq/${id}`,

        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isEditSuccessfully', { name: t('breadcrumb.faqs.title') }),
            });

            // notify('success');
            refetch();
            navigate('/faq/index');
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
                validationSchema={faqSchema()}
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
                            <FaqMainData isLoading={showDataLoading} />
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
