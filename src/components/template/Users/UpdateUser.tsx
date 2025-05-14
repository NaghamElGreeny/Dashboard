import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../../hooks/UseFetch';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import MainDataUsers from './MainData';
import * as Yup from 'yup';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';

export default function UpdateUser() {
    const { t } = useTranslation();

    const { id } = useParams();
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.users.title'), to: '/users/index' },
        { label: t('breadcrumb.users.edit') },
    ];
    const [formKey, setFormKey] = useState(0);

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `users/${id}`,
        queryKey: [`users/${id}`],
    });

    useEffect(() => {
        setFormKey(formKey + 1);
    }, [showDataSuccess]);

    const initialValues = {
        image: showData?.data?.image || '',
        name: showData?.data?.name || '',
        email: showData?.data?.email || '',
        phone: showData?.data?.phone || '',
        phone_code: showData?.data?.phone_code || '',

        gender: showData?.data?.gender || '',
        country_id: showData?.data?.country?.id || '',
        date_of_birth: showData?.data?.date_of_birth || '',
    };

    const userSchema = () =>
        Yup.object().shape({
            name: Yup.string().required(t('requiredField', { field: t('labels.name') })),

            email: Yup.string()
                .email(t('validations.email', { field: t('labels.email') }))
                .required(t('requiredField', { field: t('labels.email') })),

            password_confirmation: Yup.string().oneOf(
                [Yup.ref('password'), null],
                t('passwordsMustMatch')
            ),

            gender: Yup.string().required(t('requiredField', { field: t('labels.gender') })),
            country_id: Yup.string().required(t('requiredField', { field: t('labels.country') })),

            date_of_birth: Yup.date().required(
                t('requiredField', { field: t('labels.date_of_birth') })
            ),
        });

    // update data
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`users/${id}`],
        endpoint: `users/${id}`,

        onSuccess: (data: any) => {
            refetch();
            navigate('/users/index');
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
        // Creating the object to submit, with values formatted as needed
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

        // Remove the image if it hasn't changed from initial values
        if (initialValues?.image === finalOut.image) {
            delete finalOut.image;
        }

        // Remove undefined keys from the object before submission
        Object.keys(finalOut).forEach((key) => {
            if (finalOut[key] === undefined) {
                delete finalOut[key];
            }
        });

        update({ ...finalOut, _method: 'put' });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                validationSchema={userSchema()}
                key={formKey}
                initialValues={initialValues}
                onSubmit={(values: any) => {
                    handleSubmit(values);
                }}
            >
                <Form>
                    <MainDataUsers isLoading={showDataLoading} />
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
