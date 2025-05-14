import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import useFetch from '../../../hooks/UseFetch';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import MainDataSliders from './MainData';
import { isArabic, isEnglish } from '../../../helper/helpers';

export default function UpdateSlider() {
    const { t, i18n } = useTranslation();

    const { id } = useParams();
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.sliders.title'), to: '/sliders/index' },
        { label: t('breadcrumb.sliders.edit') },
    ];
    const [formKey, setFormKey] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `slider/${id}`,
        queryKey: [`slider/${id}`],
    });

    useEffect(() => {
        setFormKey(formKey + 1);
    }, [showDataSuccess]);

    const initialValues = {
        image: showData?.data?.media || '',
   

        ar_name: showData?.data?.ar.name || '',
        en_name: showData?.data?.en.name || '',

        external_link: showData?.data?.external_link || '',

        start_date: showData?.data?.start_date || '',
        end_date: showData?.data?.end_date || '',

        start_time: showData?.data?.start_time || '',
        end_time: showData?.data?.end_time || '',
    };

    const sliderSchema = () =>
        Yup.object().shape({
            image: Yup.mixed().required(t('requiredField', { field: t('labels.image') })),

            ar_name: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.name') + t('inArabic') }))
                .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value)),

            en_name: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.name') + t('inEnglish') }))
                .test('is-english', t('validations.englishText'), (value) => isEnglish(value)),

            external_link: Yup.string()
                .url(t('validations.url', { field: t('labels.external_link') }))
                .required(t('requiredField', { field: t('labels.external_link') })),

            start_date: Yup.date().required(t('requiredField', { field: t('labels.start_date') })),
            end_date: Yup.date().required(t('requiredField', { field: t('labels.end_date') })),

            start_time: Yup.string().required(
                t('requiredField', { field: t('labels.start_time') })
            ),

            end_time: Yup.string().required(t('requiredField', { field: t('labels.end_time') })),
        });

    // update data
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`slider/${id}`],
        endpoint: `slider/${id}`,

        onSuccess: (data: any) => {
            // notify('success');

            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isEditSuccessfully', { name: t('breadcrumb.sliders.title') }),
            });

            refetch();
            navigate('/sliders/index');
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
        const start_date = `${values.start_date} ${values.start_time}`;
        const end_date = `${values.end_date} ${values.end_time}`;

        const finalOut = {
            image: values?.image,
            ar: {
                name: values?.ar_name,
            },
            en: {
                name: values?.en_name,
            },
            external_link: values?.external_link,

            start_date,
            end_date,
        };

        if (initialValues?.image == finalOut.image) {
            delete finalOut.image;
        }

        update({ ...finalOut });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                validationSchema={sliderSchema()}
                key={formKey}
                initialValues={initialValues}
                onSubmit={(values: any) => {
                    handleSubmit(values);
                }}
            >
                {({ validateForm }) => {
                    // Listen for language changes and revalidate
                    useEffect(() => {
                        validateForm();
                    }, [i18n.language]);

                    return (
                        <Form>
                            <MainDataSliders isLoading={showDataLoading} />
                            <div className="mt-10 mb-4 flex gap-2 justify-center">
                                <Button
                                    type="submit"
                                    className="bg-primary text-white py-3 px-5 rounded-lg hover:bg-white hover:text-primary border hover:border-primary"
                                    loading={LoadingUpdate || isLoading}
                                >
                                    {t('buttons.save')}
                                </Button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}
