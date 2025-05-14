import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../../hooks/UseFetch';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import MainDataAdmins from './MainData';
import * as Yup from 'yup';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';

export default function UpdateAdmin() {
    const { t, i18n } = useTranslation();

    const { id } = useParams();
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.admins.title'), to: '/admins/index' },
        { label: t('breadcrumb.admins.edit') },
    ];
    const [formKey, setFormKey] = useState(0);

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `admin/${id}`,
        queryKey: [`admin/${id}`],
    });

    useEffect(() => {
        setFormKey(formKey + 1);
    }, [showDataSuccess]);

    const initialValues = {
        image: showData?.data?.image || '',
        full_name: showData?.data?.full_name || '',
        email: showData?.data?.email || '',
        role_id: showData?.data?.role?.id || '',

        password: '',
    };

    const adminSchema = () =>
        Yup.object().shape({
            image: Yup.mixed().required(t('requiredField', { field: t('labels.image') })),
            full_name: Yup.string().required(t('requiredField', { field: t('labels.full_name') })),
            email: Yup.string()
                .email(t('validations.email', { field: t('labels.email') }))
                .required(t('requiredField', { field: t('labels.email') })),

            role_id: Yup.string().required(t('requiredField', { field: t('labels.country') })),
        });

    // update data
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`admin/${id}`],
        endpoint: `admin/${id}`,

        onSuccess: (data: any) => {
            refetch();
            navigate('/admins/index');

            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isEditSuccessfully', { name: t('breadcrumb.admins.title') }),
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
        // Creating the object to submit, with values formatted as needed
        const finalOut: any = {
            image: values.image,
            full_name: values.full_name,
            email: values.email,
            password: values.password,
            role_id: values.role_id,
        };

        // Remove the image if it hasn't changed from initial values
        if (initialValues?.image === finalOut.image) {
            delete finalOut.image;
        }

        // Remove the password if it hasn't changed from initial values
        if (initialValues?.password === finalOut.password) {
            delete finalOut.password;
        }

        // Remove undefined keys from the object before submission
        Object.keys(finalOut).forEach((key) => {
            if (finalOut[key] === undefined || finalOut[key] === null) {
                delete finalOut[key];
            }
        });

        update({
            ...finalOut,
            // _method: 'put'
        });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                validationSchema={adminSchema()}
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
                            <MainDataAdmins isLoading={showDataLoading} />
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
