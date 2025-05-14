import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import MainCategoriesData from './MainData';
import * as Yup from 'yup';
import { isArabic, isEnglish } from '../../../helper/helpers';
import useFetch from '../../../hooks/UseFetch';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateMainCategory() {
    const { t, i18n } = useTranslation();

    const { id } = useParams();
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.main_categories.title'), to: '/main-categories/index' },
        { label: t('breadcrumb.main_categories.add') },
    ];
    const [formKey, setFormKey] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `main-categories/${id}`,
        queryKey: [`main-categories/${id}`],
    });

    useEffect(() => {
        setFormKey(formKey + 1);
    }, [showDataSuccess]);

    const initialValues = {
        image: showData?.data?.image || '',

        ar_title: showData?.data?.ar?.title || '',
        en_title: showData?.data?.en?.title || '',

        ordering: showData?.data?.ordering || '',
        gender: showData?.data?.gender || '',
    };

    const mainCategorySchema = () =>
        Yup.object().shape({
            image: Yup.mixed().required(t('requiredField', { field: t('labels.image') })),

            ar_title: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.title') + t('inArabic') }))
                .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value)),

            en_title: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.title') + t('inEnglish') }))
                .test('is-english', t('validations.englishText'), (value) => isEnglish(value)),

            ordering: Yup.number().required(t('requiredField', { field: t('labels.order') })),
            gender: Yup.string().required(t('requiredField', { field: t('labels.gender') })),
        });

    // update data
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`main-categories/${id}`],
        endpoint: `main-categories/${id}`,

        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isEditSuccessfully', { name: t('breadcrumb.main-categories.title') }),
            });

            // notify('success');
            refetch();
            navigate('/main-categories/index');
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
        const finalOut: any = {
            image: values?.image,
            ordering: values?.ordering,
            gender: values.gender,

            ar: {
                title: values?.ar_title,
            },
            en: {
                title: values?.en_title,
            },
        };

        if (initialValues?.image == finalOut.image) {
            delete finalOut.image;
        }

        // Remove undefined keys
        Object.keys(finalOut).forEach((key) => {
            if (finalOut[key] === undefined || finalOut[key] === '') {
                delete finalOut[key];
            }
        });

        update({ ...finalOut, _method: 'put' });
    };
    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                validationSchema={mainCategorySchema()}
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
                            <MainCategoriesData />
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
