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

    const initialValues = {
        ar_title: showData?.data?.ar?.title || '',
        ar_description: showData?.data?.ar?.description || '',

        en_title: showData?.data?.en?.title || '',
        en_description: showData?.data?.en?.description || '',
        type: showData?.data?.type || '',
        image: showData?.data?.image?.url || '',
        icon: showData?.data?.icon?.url || '',
    };

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
            // image: Yup.mixed()
            //     .nullable()
            //     .test('fileType', t('validation.image_only'), (value) => {
            //         if (!value) return true;
            //         return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
            //     }),
            image: Yup.mixed().required(t('requiredField', { field: t('labels.image') })),

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
        const finalOut = {
            // image: values?.image,
            ar: {
                title: values?.ar_title,
                description: values?.ar_description,
            },
            en: {
                title: values?.en_title,
                description: values?.en_description,
            },
            type: values?.type,
            // icon: { path: values?.icon?.path, url: values?.icon?.url },
            // image: { path: values?.image?.path, url: values?.image?.url }
            icon: values.icon,
            image: values.image,
        };
        console.log(finalOut);
        if (initialValues?.image == finalOut.image) {
            delete finalOut.image;
        }
        update({
            ...finalOut,
            // _method: 'put'
            _method: 'post'
        });
        // const formData = new FormData();

        // formData.append('ar[title]', values.ar_title);
        // formData.append('ar[description]', values.ar_description);

        // formData.append('en[title]', values.en_title);
        // formData.append('en[description]', values.en_description);

        // formData.append('type', values.type);

        // if (values.icon instanceof File) {
        //     formData.append('icon', values.icon);
        // }

        // if (values.image instanceof File) {
        //     formData.append('image', values.image);
        // }
        // formData.append('_method', 'post');

        // update(formData);
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                validationSchema={sectionsSchema()}
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
