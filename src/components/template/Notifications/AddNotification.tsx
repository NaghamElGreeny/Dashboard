import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import MainDataNotifications from './MainData';
import * as Yup from 'yup';
import { isArabic, isEnglish } from '../../../helper/helpers';

export default function AddNotification() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.notifications.title'), to: '/notifications/index' },
        { label: t('breadcrumb.notifications.add') },
    ];
    const [formKey, setFormKey] = useState(0);
    const initialValues = {
        ar_title: '',
        en_title: '',
        ar_body: '',
        en_body: '',
        type: '',
        user_ids: [],
    };

    const notificationSchema = () =>
        Yup.object().shape({
            ar_title: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.title') + t('inArabic') }))
                .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value)),

            en_title: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.title') + t('inEnglish') }))
                .test('is-english', t('validations.englishText'), (value) => isEnglish(value)),

            ar_body: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.body') + t('inArabic') }))
                .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value)),

            en_body: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.body') + t('inEnglish') }))
                .test('is-english', t('validations.englishText'), (value) => isEnglish(value)),

            type: Yup.string().required(t('requiredField', { field: t('labels.user_type') })),

            user_ids: Yup.array().when('type', {
                is: (val: any) => val === 'specific_provider' || val === 'specific_client',
                then: (schema) => schema.min(1, t('requiredField', { field: t('labels.users') })),
                otherwise: (schema) => schema.notRequired(),
            }),
        });

    const { mutate, isLoading } = useMutate({
        mutationKey: ['notification'],
        endpoint: `notification`,
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isCreatedSuccessfully', { name: t('breadcrumb.notifications.title') }),
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

    // Convert user_ids array to indexed format for submission
    const formatUserIdsForSubmission = (userIds: any) => {
        const formattedUserIds: any = {};
        userIds.forEach((id: number, index: any) => {
            formattedUserIds[`ids[${index}]`] = id;
        });
        return formattedUserIds;
    };

    const handleSubmit = (values: any, actions: any) => {
        // Remove user_ids array from values
        const { user_ids } = values;

        const finalOut = {
            ar: {
                title: values?.ar_title,
                body: values?.ar_body,
            },
            en: {
                title: values?.en_title,
                body: values?.en_body,
            },

            // type: values.type,
            type:
                values.type === 'specific_provider' || values.type === 'specific_client'
                    ? 'specific'
                    : values.type,

            ...formatUserIdsForSubmission(user_ids),
        };

        mutate(finalOut, {
            onSuccess: () => {
                actions.setSubmitting(false);
            },
        });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                validationSchema={notificationSchema()}
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
                            <MainDataNotifications />
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
