import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../../hooks/UseFetch';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import MainDataClients from './MainData';
import * as Yup from 'yup';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';

export default function UpdateClient() {
    const { t, i18n } = useTranslation();

    const { id } = useParams();
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.clients.title'), to: '/clients/index' },
        { label: t('breadcrumb.clients.edit') },
    ];
    const [formKey, setFormKey] = useState(0);

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `client/show/${id}`,
        queryKey: [`client/show/${id}`],
    });

    useEffect(() => {
        setFormKey(formKey + 1);
    }, [showDataSuccess]);

    const initialValues = {
        image: showData?.data?.image || '',
        full_name: showData?.data?.full_name || '',

        email: showData?.data?.email || '',
        phone: showData?.data?.phone || '',
        phone_code: showData?.data?.phone_code || '',

        is_active: showData?.data?.is_active === false ? 0 : 1 || 1,
    };

    const clientSchema = () =>
        Yup.object().shape({
            image: Yup.mixed().required(t('requiredField', { field: t('labels.image') })),
            full_name: Yup.string().required(t('requiredField', { field: t('labels.full_name') })),

            email: Yup.string()
                .email(t('validations.email', { field: t('labels.email') }))
                .required(t('requiredField', { field: t('labels.email') })),

            phone: Yup.number().required(t('requiredField', { field: t('labels.phone') })),

            is_active: Yup.string().required(t('requiredField', { field: t('labels.status') })),
        });

    // update data
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`client/update/${id}`],
        endpoint: `client/update/${id}`,

        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isEditSuccessfully', { name: t('breadcrumb.clients.title') }),
            });
            refetch();
            navigate('/clients/index');
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

            phone: values.phone,
            phone_code: values.phone_code,

            is_active: values?.is_active == false ? 0 : 1,
        };

        // Remove the image if it hasn't changed from initial values
        if (initialValues?.image === finalOut.image) {
            delete finalOut.image;
        }
        if (initialValues?.phone === finalOut.phone) {
            delete finalOut.phone;
        }
        // Remove undefined keys from the object before submission
        Object.keys(finalOut).forEach((key) => {
            if (finalOut[key] === undefined) {
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
                validationSchema={clientSchema()}
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
                            <MainDataClients isLoading={showDataLoading} />
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
