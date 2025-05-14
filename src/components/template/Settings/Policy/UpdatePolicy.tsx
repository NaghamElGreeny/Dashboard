import { Form, Formik, Field } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutate } from '../../../../hooks/UseMutate';
import Button from '../../../atoms/Button';
import useFetch from '../../../../hooks/UseFetch';
import * as Yup from 'yup';
import MainDataPolicy from './MainData';
import Loading from '../../../atoms/loading';
import ShowAlertMixin from '../../../atoms/ShowAlertMixin';

export default function UpdatePolicy() {
    const { t } = useTranslation();
    const [formKey, setFormKey] = useState(0);
    const [initialValues, setInitialValues] = useState({
        privacy_policy_ar: '',
        privacy_policy_en: '',
    });

    const {
        data: showPolicy,
        isError: showPolicyError,
        isLoading: showPolicyLoading,
        isSuccess: showPolicySuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `setting`,
        queryKey: [`setting`],
    });

    useEffect(() => {
        if (showPolicySuccess) {
            const newValues: any = { ...initialValues };
            showPolicy.data.forEach((item: any) => {
                if (newValues.hasOwnProperty(item.key)) {
                    newValues[item.key] = item.value;
                }
            });
            setInitialValues(newValues);
            setFormKey(formKey + 1);
        }
    }, [showPolicySuccess]);

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

    const policySchema = () =>
        Yup.object().shape({
            privacy_policy_ar: Yup.string().required(
                t('requiredField', { field: t('labels.privacy_policy_ar') })
            ),
            privacy_policy_en: Yup.string().required(
                t('requiredField', { field: t('labels.privacy_policy_en') })
            ),
        });

    return (
        <>
            <Formik
                validationSchema={policySchema()}
                key={formKey}
                initialValues={initialValues}
                onSubmit={(values: any) => {
                    handleSubmit(values);
                }}
                enableReinitialize
            >
                <Form>
                    <MainDataPolicy isLoading={showPolicyLoading} />
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
