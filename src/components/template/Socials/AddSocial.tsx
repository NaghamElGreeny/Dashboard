import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import MainDataSocials from './MainData';
import * as Yup from 'yup';
import { isArabic, isEnglish } from '../../../helper/helpers';

export default function AddSocial() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.socials.title'), to: '/contact-info/index' },
        { label: t('breadcrumb.socials.add') },
    ];
    const [formKey, setFormKey] = useState(0);
    const initialValues = {
        // icon: '',
        // ar_name: '',
        // en_name: '',

        // ordering: '',
        // link: '',
        key: '',
        value: ''
    };
    const socialSchema = () =>
        Yup.object().shape({
            key: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.social_name') })),

            value: Yup.string()
                .url(t('validations.url', { field: t('labels.social_link') }))
                .required(t('requiredField', { field: t('labels.social_link') })),
        });

    const { mutate, isLoading } = useMutate({
        mutationKey: ['contact-info'],
        endpoint: `contact-info`,
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
        const finalOut = {
            key: values?.key,
            value: values?.value
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
                validationSchema={socialSchema()}
                key={formKey}
                initialValues={initialValues}
                onSubmit={(values, actions) => {
                    handleSubmit(values, actions);
                }}
            >
                <Form>
                    <MainDataSocials />
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
            </Formik>
        </div>
    );
}
