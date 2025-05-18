import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../../hooks/UseFetch';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import MainDataSocials from './MainData';
import * as Yup from 'yup';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { isArabic, isEnglish } from '../../../helper/helpers';

export default function UpdateSocial() {
    const { t } = useTranslation();

    const { id } = useParams();
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.socials.title'), to: 'contact-info/index' },
        { label: t('breadcrumb.socials.edit') },
    ];
    const [formKey, setFormKey] = useState(0);

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `contact-info/${id}`,
        queryKey: [`contact-info/${id}`],
    });

    useEffect(() => {
        setFormKey(formKey + 1);
    }, [showDataSuccess]);

    const initialValues = {
        icon: showData?.data?.icon || '',
        ar_name: showData?.data?.ar.name || '',
        en_name: showData?.data?.en?.name || '',

        ordering: showData?.data?.ordering || '',
        link: showData?.data?.link || '',
    };

    const socialSchema = () =>
        Yup.object().shape({
            ar_name: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.name') + t('inArabic') }))
                .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value)),

            en_name: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.name') + t('inEnglish') }))
                .test('is-english', t('validations.englishText'), (value) => isEnglish(value)),

            ordering: Yup.number().required(t('requiredField', { field: t('labels.order') })),

            link: Yup.string()
                .url(t('validations.url', { field: t('labels.link') }))
                .required(t('requiredField', { field: t('labels.link') })),
        });

    // update data
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`contact-info/${id}`],
        endpoint: `contact-info/${id}`,

        onSuccess: (data: any) => {
            // notify('success');
            refetch();
            navigate('/contact-info/index');
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
        const finalOut = {
            id: values?.id,
            key: values?.key,
            value: values?.value,
        };


        update({ ...finalOut, _method: 'put' });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                validationSchema={socialSchema()}
                key={formKey}
                initialValues={initialValues}
                onSubmit={(values: any) => {
                    handleSubmit(values);
                }}
            >
                <Form>
                    <MainDataSocials isLoading={showDataLoading} />
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
