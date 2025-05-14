import { Form, Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../Auth/AuthProvider';
import useFetch from '../../../hooks/UseFetch';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import PasswordMainData from './PasswordMainData';
import * as Yup from 'yup';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';

export default function ChangePassword() {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();

    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.profile.title'), to: '/profile' },
        { label: t('breadcrumb.profile.edit') },
    ];
    const [formKey, setFormKey] = useState(0);

    const initialValues: any = {
        password: '',
        new_password: '',
        password_confirmation: '',
    };

    const passwordSchema = () =>
        Yup.object().shape({
            password: Yup.string().required(t('requiredField', { field: t('labels.password') })),
            new_password: Yup.string().required(
                t('requiredField', { field: t('labels.new_password') })
            ),
            password_confirmation: Yup.string()
                .oneOf([Yup.ref('new_password'), null], t('passwordsMustMatch'))
                .required(t('requiredField', { field: t('labels.password_confirmation') })),
        });

    // update data
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`profile/update-password`],
        endpoint: `profile/update-password`,

        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isEditSuccessfully', { name: t('breadcrumb.profile.change_password') }),
            });

            // notify('success');
            // navigate('/profile');
            window.location.replace('/profile');
            user(data?.data?.data);
        },
        onError: (err: any) => {
            // notify('error', err);
            ShowAlertMixin({
                type: 15,
                icon: 'error',
                title: err?.response?.data?.message,
            });
        },

        formData: true,
    });

    // const handleSubmit = (values: any) => {
    //     update({ ...values });
    // };

    const handleSubmit = (values: any) => {
        const finalOut = {
            current_password: values?.password,
            new_password: values?.new_password,
            new_password_confirmation: values?.password_confirmation,
        };

        update({
            ...finalOut,
            //  _method: 'put'
        });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                validationSchema={passwordSchema()}
                key={formKey}
                initialValues={initialValues}
                onSubmit={(values: any) => {
                    handleSubmit(values);
                }}
            >
                <Form>
                    <PasswordMainData />
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
            </Formik>
        </div>
    );
}
