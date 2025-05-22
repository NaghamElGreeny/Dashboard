import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import useFetch from '../../../../hooks/UseFetch';
import { useMutate } from '../../../../hooks/UseMutate';
import Button from '../../../atoms/Button';
import ShowAlertMixin from '../../../atoms/ShowAlertMixin';
import MainDataGeneral from './MainData';

export default function UpdateGeneral() {
    const { t, i18n } = useTranslation();
    const [formKey, setFormKey] = useState(0);
    const [initialValues, setInitialValues] = useState({
        phone: '',
        email: '',
        address: '',
        facebook: '',
        x: '',
        instagram: '',
        appoitnments: '',
    });
    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `contact-info`,
        queryKey: [`contact-info`],
    });

    useEffect(() => {
        if (showDataSuccess) {
            const newValues: any = { ...initialValues };
            showData.data.forEach((item: any) => {
                if (newValues.hasOwnProperty(item.key)) {
                    newValues[item.key] = item.value;
                }
            });
            console.log(showData?.data)
            setInitialValues(newValues); // Update initialValues with new data
            setFormKey(formKey + 1); // Increment formKey to force a re-render
        }
    }, [showDataSuccess]);
    console.log(initialValues)
    // Update data
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`contact-info`],
        endpoint: `contact-info`,
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isEditSuccessfully', { name: t('breadcrumb.mainSettings') }),
            });

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
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            formData.append(key, values[key]);
        });
        update(formData);
    };

    const generalSettingsSchema = () =>
        Yup.object().shape({
            // phone: Yup.string()
            //     .trim()
            //     .required(t('requiredField', { field: t('labels.whatsapp') })),

            // email: Yup.string()
            //     .trim()
            //     // .url(t('validations.', { field: t('labels.email') }))
            //     .required(t('requiredField', { field: t('labels.linkedIn_link') })),
            // address: Yup.string()
            //     .trim()
            //     .required(t('requiredField', { field: t('labels.address') })),
            // facebook: Yup.string()
            //     .url(t('validations.url', { field: t('labels.facebook_link') }))
            //     .required(t('requiredField', { field: t('labels.facebook_link') })),

            // x: Yup.string()
            //     .url(t('validations.url', { field: t('labels.x_link') }))
            //     .required(t('requiredField', { field: t('labels.x_link') })),

            // instagram: Yup.string()
            //     .url(t('validations.url', { field: t('labels.snapchat_link') }))
            //     .required(t('requiredField', { field: t('labels.snapchat_link') })),

            // appointments: Yup.string()
            //     .trim()
            //     .required(t('requiredField', { field: t('labels.appointments') })),
        });


    return (
        <>
            <Formik
                validationSchema={generalSettingsSchema()}
                key={formKey}
                initialValues={initialValues}
                onSubmit={(values: any) => {
                    handleSubmit(values);
                }}
                enableReinitialize
            >
                {({ validateForm }) => {
                    // Listen for language changes and revalidate
                    useEffect(() => {
                        validateForm();
                    }, [i18n.language]);

                    return (
                        <Form>
                            <MainDataGeneral isLoading={showDataLoading} />
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
        </>
    );
}
