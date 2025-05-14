import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { isArabic, isEnglish } from '../../../helper/helpers';
import useFetch from '../../../hooks/UseFetch';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import ServicesMainData from './MainData';
import { hasPermission } from '../../../helper/permissionHelpers';

export default function UpdateServices() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.services.title') },
    ];
    const [formKey, setFormKey] = useState(0);

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch,
    } = useFetch<any>({
        endpoint: `service`,
        // @ts-ignore
        queryKey: [`service`, hasPermission('service.index')],
        enabled: !!hasPermission('service.index'),
    });

    useEffect(() => {
        setFormKey(formKey + 1);
    }, [showDataSuccess]);

    const initialValues = {
        services:
            showData?.data?.length > 0
                ? showData.data.map((service: any) => ({
                      id: service?.id || null,
                      ar_service: service?.ar?.service || '',
                      en_service: service?.en?.service || '',
                      type: service?.type || '',
                  }))
                : [
                      { ar_service: '', en_service: '', type: '' },
                      { ar_service: '', en_service: '', type: '' },
                  ],
    };

    const servicesSchema = () =>
        Yup.object().shape({
            services: Yup.array().of(
                Yup.object().shape({
                    type: Yup.string().required(t('requiredField', { field: t('labels.type') })),
                    ar_service: Yup.string()
                        .trim()
                        .required(
                            t('requiredField', { field: t('labels.service') + t('inArabic') })
                        )
                        .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value)),

                    en_service: Yup.string()
                        .trim()
                        .required(
                            t('requiredField', { field: t('labels.service') + t('inEnglish') })
                        )
                        .test('is-english', t('validations.englishText'), (value) =>
                            isEnglish(value)
                        ),
                })
            ),
        });

    // update data
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`service`],
        endpoint: `service`,

        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isEditSuccessfully', { name: t('breadcrumb.services.title') }),
            });
            // notify('success');
            refetch();
            refetch().then(() => {
                setFormKey(formKey + 1);
            });
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
            services: values?.services?.map((item: any) => ({
                type: item.type,
                ar: {
                    service: item.ar_service,
                },
                en: {
                    service: item.en_service,
                },
            })),
        };

        // Remove undefined keys
        Object.keys(finalOut).forEach((key) => {
            if (finalOut[key] === undefined) {
                delete finalOut[key];
            }
        });

        update({
            ...finalOut,
            // _method: 'put',
        });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                validationSchema={servicesSchema()}
                key={formKey}
                enableReinitialize={true}
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
                            <ServicesMainData isLoading={showDataLoading} />
                            <div className="mt-10 mb-4 flex gap-2 justify-center">
                                {hasPermission('service.updateOrCreate') && (
                                    <Button
                                        type="submit"
                                        className="bg-primary text-white py-3 px-5 rounded-lg hover:bg-white hover:text-primary border hover:border-primary"
                                        loading={LoadingUpdate}
                                    >
                                        {t('buttons.save')}
                                    </Button>
                                )}
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}
