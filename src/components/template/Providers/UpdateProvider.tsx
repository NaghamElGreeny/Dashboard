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
import MainDataProviders from './MainData';

export default function UpdateProvider() {
    const { t } = useTranslation();

    const { id } = useParams();
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.providers.title'), to: '/providers/index' },
        { label: t('breadcrumb.providers.edit') },
    ];
    const [formKey, setFormKey] = useState(0);

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `provider/${id}`,
        queryKey: [`provider/${id}`],
    });

    useEffect(() => {
        setFormKey(formKey + 1);
    }, [showDataSuccess]);

    const initialValues = {
        category_id: showData?.data?.category_data?.id || '',
        subcategory_id: showData?.data?.subcategory_data?.id || '',
    };

    const providerSchema = () =>
        Yup.object().shape({
            category_id: Yup.string().required(
                t('requiredField', { field: t('labels.main_category') })
            ),
            subcategory_id: Yup.string().required(
                t('requiredField', { field: t('labels.sub_category') })
            ),
        });

    // update data
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`provider/${id}`],
        endpoint: `provider/${id}`,

        onSuccess: (data: any) => {
            // notify('success');
            refetch();
            navigate('/providers/index');
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
            category_id: values?.category_id,
            subcategory_id: values?.subcategory_id,
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
                validationSchema={providerSchema()}
                key={formKey}
                initialValues={initialValues}
                onSubmit={(values: any) => {
                    handleSubmit(values);
                }}
            >
                <Form>
                    <MainDataProviders isLoading={showDataLoading} />
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
