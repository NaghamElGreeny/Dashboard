import { Form, Formik, Field } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutate } from '../../../../hooks/UseMutate';
import Button from '../../../atoms/Button';
import useFetch from '../../../../hooks/UseFetch';
import * as Yup from 'yup';
import MainDataAboutUs from './MainData';
import Loading from '../../../atoms/loading';
import ShowAlertMixin from '../../../atoms/ShowAlertMixin';

export default function UpdateAboutUs() {
    const { t } = useTranslation();
    const [formKey, setFormKey] = useState(0);
    const [initialValues, setInitialValues] = useState({
        about_ar: '',
        about_en: '',
    });

    const {
        data: showAboutUs,
        isError: showAboutUsError,
        isLoading: showAboutUsLoading,
        isSuccess: showAboutUsSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `setting`,
        queryKey: [`setting`],
    });

    useEffect(() => {
        if (showAboutUsSuccess) {
            const newValues: any = { ...initialValues };
            showAboutUs.data.forEach((item: any) => {
                if (newValues.hasOwnProperty(item.key)) {
                    newValues[item.key] = item.value;
                }
            });
            setInitialValues(newValues);
            setFormKey(formKey + 1);
        }
    }, [showAboutUsSuccess]);

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

    const aboutSchema = () =>
        Yup.object().shape({
            about_ar: Yup.string().required(t('requiredField', { field: t('labels.about_ar') })),
            about_en: Yup.string().required(t('requiredField', { field: t('labels.about_en') })),
        });

    return (
        <>
            <Formik
                validationSchema={aboutSchema()}
                key={formKey}
                initialValues={initialValues}
                onSubmit={(values: any) => {
                    handleSubmit(values);
                }}
                enableReinitialize
            >
                <Form>
                    <MainDataAboutUs isLoading={showAboutUsLoading} />
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
