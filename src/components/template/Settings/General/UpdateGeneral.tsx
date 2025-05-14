import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import useFetch from '../../../../hooks/UseFetch';
import { useMutate } from '../../../../hooks/UseMutate';
import Button from '../../../atoms/Button';
import ShowAlertMixin from '../../../atoms/ShowAlertMixin';
import MainDataSocial from './MainData';

export default function UpdateGeneral() {
    const { t } = useTranslation();
    const [formKey, setFormKey] = useState(0);
    const [initialValues, setInitialValues] = useState({
        confirm_order_duration: '',
        order_cancellation_period: '',
        cancellation_precentage_refund: '',
        notification_duration_period: '',
        link_duration_period: '',
        provider_activation_period: '',
        provider_duration_order_acception: '',
        provider_free_sessions: '',
        provider_free_sessions_duration: '',
        additional_fees: '',
        nearest_provider_range: '',
        reschedule_booking_duration: '',
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

    const generalSchema = () =>
        Yup.object().shape({
            notification_duration_period: Yup.number().required(
                t('requiredField', { field: t('labels.notification_duration_period') })
            ),

            confirm_order_duration: Yup.number().required(
                t('requiredField', { field: t('labels.confirm_order_duration') })
            ),
            order_cancellation_period: Yup.number().required(
                t('requiredField', { field: t('labels.order_cancellation_period') })
            ),
            cancellation_precentage_refund: Yup.number().required(
                t('requiredField', { field: t('labels.cancellation_precentage_refund') })
            ),
            link_duration_period: Yup.number().required(
                t('requiredField', { field: t('labels.link_duration_period') })
            ),
            provider_activation_period: Yup.number().required(
                t('requiredField', { field: t('labels.provider_activation_period') })
            ),
            provider_duration_order_acception: Yup.number().required(
                t('requiredField', { field: t('labels.provider_duration_order_acception') })
            ),
            provider_free_sessions: Yup.number().required(
                t('requiredField', { field: t('labels.provider_free_sessions') })
            ),
            provider_free_sessions_duration: Yup.number().required(
                t('requiredField', { field: t('labels.provider_free_sessions_duration') })
            ),
            additional_fees: Yup.number().required(
                t('requiredField', { field: t('labels.additional_fees') })
            ),
            nearest_provider_range: Yup.number().required(
                t('requiredField', { field: t('labels.nearest_provider_range') })
            ),
            reschedule_booking_duration: Yup.number().required(
                t('requiredField', { field: t('labels.reschedule_booking_duration') })
            ),
        });

    return (
        <>
            <Formik
                validationSchema={generalSchema()}
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
