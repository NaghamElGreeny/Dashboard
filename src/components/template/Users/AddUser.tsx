import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import UsersMainData from './MainData';
import * as Yup from 'yup';

export default function AddUser() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.users.title'), to: '/users/index' },
        { label: t('breadcrumb.users.add') },
    ];
    const [formKey, setFormKey] = useState(0);

    const initialValues = {
        image: '',
        name: '',
        email: '',
        phone: '',
        phone_code: '',
        password: '',
        password_confirmation: '',
        gender: '',
        country_id: '',
        date_of_birth: '',
    };

    const userSchema = () =>
        Yup.object().shape({
            name: Yup.string().required(t('requiredField', { field: t('labels.name') })),

            email: Yup.string()
                .email(t('validations.email', { field: t('labels.email') }))
                .required(t('requiredField', { field: t('labels.email') })),

            password: Yup.string().required(t('requiredField', { field: t('labels.password') })),
            password_confirmation: Yup.string()
                .oneOf([Yup.ref('password'), null], t('passwordsMustMatch'))
                .required(t('requiredField', { field: t('labels.password_confirmation') })),
            gender: Yup.string().required(t('requiredField', { field: t('labels.gender') })),
            country_id: Yup.string().required(t('requiredField', { field: t('labels.country') })),

            date_of_birth: Yup.date().required(
                t('requiredField', { field: t('labels.date_of_birth') })
            ),
        });

    const { mutate, isLoading } = useMutate({
        mutationKey: ['users'],
        endpoint: `users`,
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isCreatedSuccessfully', { name: t('breadcrumb.users.title') }),
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
            email: values.email,
            name: values.name,
            phone: values.phone,
            phone_code: values.phone_code,
            gender: values.gender,
            country_id: values?.country_id,
            date_of_birth: values?.date_of_birth,
            password: values.password,

            // password_confirmation: values.password_confirmation,
        };

        // Remove undefined keys
        Object.keys(finalOut).forEach((key) => {
            if (finalOut[key] === undefined) {
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
                validationSchema={userSchema()}
                key={formKey}
                initialValues={initialValues}
                onSubmit={(values, actions) => {
                    handleSubmit(values, actions);
                }}
            >
                <Form>
                    <UsersMainData />
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
