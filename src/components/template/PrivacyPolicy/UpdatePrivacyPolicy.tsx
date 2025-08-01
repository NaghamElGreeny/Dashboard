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
import PolicyMainData from './MainData';
import { hasPermission } from '../../../helper/permissionHelpers';

export default function UpdatePrivacyPolicy() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.privacy_policy.title') },
    ];
    const [formKey, setFormKey] = useState(0);

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `policy`,
        // @ts-ignore
        queryKey: [`policy`, hasPermission('policy.index')],
        enabled: !!hasPermission('policy.index'),
    });

    useEffect(() => {
        setFormKey(formKey + 1);
    }, [showDataSuccess]);

    const initialValues = {
        ar_title: showData?.data?.ar?.title || '',
        ar_description: showData?.data?.ar?.desc || '',

        en_title: showData?.data?.en?.title || '',
        en_description: showData?.data?.en?.desc || '',
    };

    const privacySchema = () =>
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
        });

    // update data
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`policy`],
        endpoint: `policy`,

        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isEditSuccessfully', { name: t('breadcrumb.privacy_policy.title') }),
            });

            // notify('success');
            refetch();
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
                title: values?.ar_title,
                desc: values?.ar_description,
            },
            en: {
                title: values?.en_title,
                desc: values?.ar_description,
            },
        };

        // Remove undefined keys
        Object.keys(finalOut).forEach((key) => {
            if (finalOut[key] === undefined) {
                delete finalOut[key];
            }
        });

        update({
            ...finalOut,
            //  _method: 'put'
        });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                validationSchema={privacySchema()}
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
                            <PolicyMainData isLoading={showDataLoading} />
                            <div className="mt-10 mb-4 flex gap-2 justify-center">
                                {hasPermission('policy.updateOrCreate') && (
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
