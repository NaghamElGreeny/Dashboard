import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import AdminsMainData from './MainData';
import * as Yup from 'yup';

export default function AddAdmin() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.admins.title'), to: '/admins/index' },
        { label: t('breadcrumb.admins.add') },
    ];
    const [formKey, setFormKey] = useState(0);

    const initialValues = {
        image: '',
        full_name: '',
        email: '',
        password: '',
        role_id: '',
    };

    const adminSchema = () =>
        Yup.object().shape({
            image: Yup.mixed().required(t('requiredField', { field: t('labels.image') })),
            full_name: Yup.string().required(t('requiredField', { field: t('labels.full_name') })),
            email: Yup.string()
                .email(t('validations.email', { field: t('labels.email') }))
                .required(t('requiredField', { field: t('labels.email') })),

            password: Yup.string().required(t('requiredField', { field: t('labels.password') })),

            role_id: Yup.string().required(t('requiredField', { field: t('labels.country') })),
        });

    const { mutate, isLoading } = useMutate({
        mutationKey: ['admin'],
        endpoint: `admin`,
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isCreatedSuccessfully', { name: t('breadcrumb.admins.title') }),
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
        const finalOut: any = {
            image: values.image,
            full_name: values.full_name,
            email: values.email,
            password: values.password,
            role_id: values.role_id,
        };

        // Remove undefined keys
        Object.keys(finalOut).forEach((key) => {
            if (finalOut[key] === undefined || finalOut[key] === '') {
                delete finalOut[key];
            }
        });

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
                validationSchema={adminSchema()}
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
                            <AdminsMainData />
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
