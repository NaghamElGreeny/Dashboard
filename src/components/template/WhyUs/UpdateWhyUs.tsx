import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { isArabic, isEnglish } from '../../../helper/helpers';
import useFetch from '../../../hooks/UseFetch';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import WhyUsMainData from './MainData';
import { hasPermission } from '../../../helper/permissionHelpers';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateWhyus() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.about.title'), to: '/why-us/index' },
        { label: t('breadcrumb.about.edit') },
    ];
    const [formKey, setFormKey] = useState(0);

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch,
    } = useFetch<any>({
        endpoint: `why-us/${id}`,
        // @ts-ignore
        queryKey: [`why-us/${id}`, hasPermission('whyus.index')],
        enabled: !!hasPermission('whyus.index'),
    });

    useEffect(() => {
        setFormKey(formKey + 1);
    }, [showDataSuccess]);
    console.log(showData?.data);
    const initialValues = {
        ar_key: showData?.data?.ar?.key || '',
        en_key: showData?.data?.en?.key || '',
        value: showData?.data?.value || '',
        _image: showData?.data?.icon?.url || 'url not found',
    };

    const whyusSchema = () =>
        Yup.object().shape({
            icon: Yup.mixed()
                .nullable()
                .test('fileType', t('validation.image_only'), (value) => {
                    if (!value) return true;
                    return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
                }),
            ar_key: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.title') + t('inArabic') }))
                .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value)),

            en_key: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.title') + t('inEnglish') }))
                .test('is-english', t('validations.englishText'), (value) => isEnglish(value)),

            value: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.title') })),

        });

    // update data
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`why-us/${id}`],
        endpoint: `why-us/${id}`,

        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isEditSuccessfully', { name: t('breadcrumb.about.title') }),
            });
            // notify('success');
            refetch();
            refetch().then(() => {
                setFormKey(formKey + 1);
            });
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
        const finalOut: any = {
            ar: {
                title: values?.ar_key,
            },
            en: {
                title: values?.en_key,
            },
            value: values?.value,
            is_active: true,
            // icon: { url: values?.icon, }
            icon: values?.icon?.path,

            // icon: {
            //     "path": "images\\\\User\\\\ePArQddOEFe8VvzdArOKnJFIwcBEbFsr6H090d75.png",
            //     "url": "https://shebl.backend.aait-d.com/dashboardAssets/images/cover/cover_sm.png"
            // },

        };

        // Remove undefined keys
        Object.keys(finalOut).forEach((key) => {
            if (finalOut[key] === undefined) {
                delete finalOut[key];
            }
        });

        update({
            ...finalOut,
            // _method: 'put',
            _method: 'post'
        });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                validationSchema={whyusSchema()}
                key={formKey}
                enableReinitialize={true}
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
                            <WhyUsMainData isLoading={showDataLoading}
                                data={showData} />
                            <div className="mt-10 mb-4 flex gap-2 justify-center">
                                {hasPermission('about.updateOrCreate') && (
                                    <Button
                                        type="submit"
                                        className="bg-primary text-white py-3 px-5 rounded-lg hover:bg-white hover:text-primary border hover:border-primary"
                                        loading={LoadingUpdate}
                                    >
                                        {t('buttons.save')}
                                    </Button>
                                )}
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}
