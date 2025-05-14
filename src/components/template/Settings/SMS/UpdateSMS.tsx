import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import useFetch from '../../../../hooks/UseFetch';
import { useMutate } from '../../../../hooks/UseMutate';
import Button from '../../../atoms/Button';
import ShowAlertMixin from '../../../atoms/ShowAlertMixin';
import MainDataSocial from './MainData';

export default function UpdateSMS() {
    const { t } = useTranslation();
    const [formKey, setFormKey] = useState(0);
    const [initialValues, setInitialValues] = useState({
        sms_username: '',
        sms_sender_name: '',
        sms_provider: '',
        sms_password: '',
    });

    const {
        data: showSocial,
        isError: showSocialError,
        isLoading: showSocialLoading,
        isSuccess: showSocialSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `setting`,
        queryKey: [`setting`],
    });

    useEffect(() => {
        if (showSocialSuccess) {
            const newValues: any = { ...initialValues };
            showSocial.data.forEach((item: any) => {
                if (newValues.hasOwnProperty(item.key)) {
                    newValues[item.key] = item.value;
                }
            });
            setInitialValues(newValues);
            setFormKey(formKey + 1);
        }
    }, [showSocialSuccess]);

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

    const socialSchema = () =>
        Yup.object().shape({
            sms_password: Yup.string().required(
                t('requiredField', { field: t('labels.sms_password') })
            ),

            sms_username: Yup.string().required(
                t('requiredField', { field: t('labels.sms_username') })
            ),
            sms_sender_name: Yup.string().required(
                t('requiredField', { field: t('labels.sms_sender_name') })
            ),
            sms_provider: Yup.string().required(
                t('requiredField', { field: t('labels.sms_provider') })
            ),
        });

    return (
        <>
            <Formik
                validationSchema={socialSchema()}
                key={formKey}
                initialValues={initialValues}
                onSubmit={(values: any) => {
                    handleSubmit(values);
                }}
                enableReinitialize
            >
                <Form>
                    <MainDataSocial isLoading={showSocialLoading} />
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
        </>
    );
}
