import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../../hooks/UseFetch';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import MainDataPages from './MainData';
import * as Yup from 'yup';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { isArabic, isEnglish } from '../../../helper/helpers';

export default function UpdateStaticPage() {
    const { t, i18n } = useTranslation();

    const { id } = useParams();
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.static_pages.title'), to: '/static-pages/index' },
        { label: t('breadcrumb.static_pages.edit') },
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

    const initialValues = {
        ar_title: showData?.data?.ar?.title || '',
        en_title: showData?.data?.en?.title || '',

        ar_description: showData?.data?.ar?.description || '',
        en_description: showData?.data?.en?.description || '',

        type: showData?.data?.type || '',
    };
    console.log(initialValues)
    const pageSchema = () =>
        Yup.object().shape({
            ar_title: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.title') + t('inArabic') }))
                .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value)),

            en_title: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.title') + t('inEnglish') }))
                .test('is-english', t('validations.englishText'), (value) => isEnglish(value)),

            ar_description: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.description') + t('inArabic') }))
                .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value)),

            en_description: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.description') + t('inEnglish') }))
                .test('is-english', t('validations.englishText'), (value) => isEnglish(value)),

            type: Yup.string().required(t('requiredField', { field: t('labels.type') })),
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
                    t('isEditSuccessfully', { name: t('breadcrumb.pages.title') }),
            });

            // notify('success');
            refetch();
            navigate('/static-pages/index');
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
            is_active: 1,
            type: values?.type,

            ar: {
                title: values?.ar_title,
                description: values?.ar_description,
            },
            en: {
                title: values?.en_title,
                description: values?.en_description,
            },
        };
        console.log('finaaaaaal', finalOut)
        update({
            ...finalOut,
            // _method: 'post'
            _method: 'put'
        });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                validationSchema={pageSchema()}
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
                            <MainDataPages isLoading={showDataLoading} />
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
