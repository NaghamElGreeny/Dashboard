import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import MainDataLanguages from './MainData';
import * as Yup from 'yup';
import { isArabic, isEnglish } from '../../../helper/helpers';

export default function AddLanguage() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.languages.title'), to: '/languages/index' },
        { label: t('breadcrumb.languages.add') },
    ];
    const [formKey, setFormKey] = useState(0);
    const initialValues = {
        ar_language: '',
        en_language: '',
    };

    const languagesSchema = () =>
        Yup.object().shape({
            ar_language: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.language') + t('inArabic') }))
                .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value)),

            en_language: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.language') + t('inEnglish') }))
                .test('is-english', t('validations.englishText'), (value) => isEnglish(value)),
        });

    const { mutate, isLoading } = useMutate({
        mutationKey: ['language'],
        endpoint: `language`,
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isCreatedSuccessfully', { name: t('breadcrumb.languages.title') }),
            });

            setFormKey(formKey + 1);
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

    const handleSubmit = (values: any, actions: any) => {
        const finalOut: any = {
            ar: {
                language: values?.ar_language,
            },
            en: {
                language: values?.en_language,
            },
        };

        // Remove undefined keys
        Object.keys(finalOut).forEach((key) => {
            if (finalOut[key] === undefined || finalOut[key] === '') {
                delete finalOut[key];
            }
        });

        mutate(finalOut, {
            onSuccess: () => {
                // Reset the form to initial values
                actions.setSubmitting(false);
            },
        });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                validationSchema={languagesSchema()}
                key={formKey}
                initialValues={initialValues}
                onSubmit={(values, actions) => {
                    handleSubmit(values, actions);
                }}
            >
                <Form>
                    <MainDataLanguages />
                    <div className="mt-10 mb-4 flex gap-2 justify-center">
                        <Button
                            type="submit"
                            className="bg-primary text-white py-3 px-5 rounded-lg hover:bg-white hover:text-primary border hover:border-primary"
                            loading={isLoading}
                        >
                            {t('buttons.save')}
                        </Button>
                    </div>
                </Form>
            </Formik>
        </div>
    );
}
