import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { isArabic, isEnglish } from '../../../helper/helpers';
import useFetch from '../../../hooks/UseFetch';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import MainDataCancelReasons from './MainData';

export default function UpdateCancelReason() {
    const { t } = useTranslation();

    const { id } = useParams();
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.cancelReasons.title'), to: '/cancel-reasons/index' },
        { label: t('breadcrumb.cancelReasons.edit') },
    ];
    const [formKey, setFormKey] = useState(0);

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `cancel-reason/${id}`,
        queryKey: [`cancel-reason/${id}`],
    });

    useEffect(() => {
        setFormKey(formKey + 1);
    }, [showDataSuccess]);

    const initialValues = {
        ar_reason: showData?.data?.ar.reason || '',
        en_reason: showData?.data?.en.reason || '',
    };

    const cancelReasonSchema = () =>
        Yup.object().shape({
            ar_reason: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.reason') + t('inArabic') }))
                .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value)),

            en_reason: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.reason') + t('inEnglish') }))
                .test('is-english', t('validations.englishText'), (value) => isEnglish(value)),
        });

    // update data
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`cancel-reason/${id}`],
        endpoint: `cancel-reason/${id}`,

        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isEditSuccessfully', { name: t('breadcrumb.cancelReasons.title') }),
            });

            // notify('success');
            refetch();
            navigate('/cancel-reasons/index');
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
        const finalOut: any = {
            ar: {
                reason: values?.ar_reason,
            },
            en: {
                reason: values?.en_reason,
            },
        };

        // Remove undefined keys from the object before submission
        Object.keys(finalOut).forEach((key) => {
            if (finalOut[key] === undefined || finalOut[key] === null) {
                delete finalOut[key];
            }
        });

        update({
            ...finalOut,
            //  _method: 'put'
        });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                validationSchema={cancelReasonSchema()}
                key={formKey}
                initialValues={initialValues}
                onSubmit={(values: any) => {
                    handleSubmit(values);
                }}
            >
                <Form>
                    <MainDataCancelReasons isLoading={showDataLoading} />
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
