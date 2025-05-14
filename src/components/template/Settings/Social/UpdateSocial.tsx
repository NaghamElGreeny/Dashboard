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
        whatsapp: '',
        facebook: '',
        x: '',
        linkedIn: '',
        snapchat: '',
        tiktok: '',
    });

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `setting`,
        queryKey: [`setting`],
    });

    useEffect(() => {
        if (showDataSuccess) {
            const newValues: any = { ...initialValues };
            showData.data.forEach((item: any) => {
                if (newValues.hasOwnProperty(item.key)) {
                    newValues[item.key] = item.value;
                }
            });
            setInitialValues(newValues); // Update initialValues with new data
            setFormKey(formKey + 1); // Increment formKey to force a re-render
        }
    }, [showDataSuccess]);

    // Update data
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`setting`],
        endpoint: `setting`,
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
            whatsapp: Yup.string()
                .url(t('validations.url', { field: t('labels.whatsapp') }))
                .required(t('requiredField', { field: t('labels.whatsapp') })),

            facebook: Yup.string()
                .url(t('validations.url', { field: t('labels.facebook_link') }))
                .required(t('requiredField', { field: t('labels.facebook_link') })),

            x: Yup.string()
                .url(t('validations.url', { field: t('labels.x_link') }))
                .required(t('requiredField', { field: t('labels.x_link') })),

            linkedIn: Yup.string()
                .url(t('validations.url', { field: t('labels.linkedIn_link') }))
                .required(t('requiredField', { field: t('labels.linkedIn_link') })),

            snapchat: Yup.string()
                .url(t('validations.url', { field: t('labels.snapchat_link') }))
                .required(t('requiredField', { field: t('labels.snapchat_link') })),

            tiktok: Yup.string()
                .url(t('validations.url', { field: t('labels.tiktok_link') }))
                .required(t('requiredField', { field: t('labels.tiktok_link') })),
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
