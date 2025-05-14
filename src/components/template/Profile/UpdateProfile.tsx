import { Form, Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { AuthContext } from '../../../Auth/AuthProvider';
import useFetch from '../../../hooks/UseFetch';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import ProfileMainData from './ProfileMainData';

export default function UpdateProfile() {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();

    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.profile.title'), to: '/profile' },
        { label: t('breadcrumb.profile.edit') },
    ];
    const [formKey, setFormKey] = useState(0);

    const {
        data: showProfile,
        isError: showProfileError,
        isLoading: showProfileLoading,
        isSuccess: showProfileSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `profile`,
        queryKey: [`profile`],
    });

    useEffect(() => {
        setFormKey(formKey + 1);
    }, [showProfileSuccess]);

    const initialValues = {
        image: showProfile?.data?.image || '',
        full_name: showProfile?.data?.full_name || '',
        phone: showProfile?.data?.phone || '',
        phone_code: showProfile?.data?.phone_code || '',
        email: showProfile?.data?.email || '',
    };

    const profileSchema = () =>
        Yup.object().shape({
            full_name: Yup.string().required(t('requiredField', { field: t('labels.name') })),
            email: Yup.string()
                .email(t('validations.email', { field: t('labels.email') }))
                .required(t('requiredField', { field: t('labels.email') })),
            phone: Yup.number().required(t('requiredField', { field: t('labels.phone') })),
        });

    // update data
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`profile`],
        endpoint: `profile`,

        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isEditSuccessfully', { name: t('breadcrumb.profile.title') }),
            });
            // notify('success');
            refetch();
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

    const handleSubmit = (values: any) => {
        if (initialValues?.image == values.image) {
            delete values.image;
        }

        update({
            ...values,
            //  _method: 'put'
        });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            <Formik
                validationSchema={profileSchema()}
                key={formKey}
                initialValues={initialValues}
                onSubmit={(values: any) => {
                    handleSubmit(values);
                }}
            >
                <Form>
                    <ProfileMainData isLoading={showProfileLoading} />
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
