import { Form, Formik } from 'formik';
import { useState, Dispatch, SetStateAction } from 'react';

import { useTranslation } from 'react-i18next';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import MainDataBanUser from './MainData';
import * as Yup from 'yup';

type BanUser_TP = {
    refetch: () => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
    dataInfo?: any;
    apiName?: any;
};

export default function BanUser({ setOpen, refetch, dataInfo, apiName }: BanUser_TP) {
    const { t } = useTranslation();

    const [formKey, setFormKey] = useState(0);
    const initialValues = {
        ban_reason: '',
    };

    const banUserSchema = () =>
        Yup.object().shape({
            ban_reason: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.ban_reason') })),
        });

    const { mutate, isLoading } = useMutate({
        mutationKey: [`${apiName}`],
        endpoint: `${apiName}`,
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isCreatedSuccessfully', { name: t('breadcrumb.categories.title') }),
            });

            setFormKey(formKey + 1);
            setOpen(false);
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

    const handleSubmit = (values: any, actions: any) => {
        const finalOut = {
            id: dataInfo,
            ban_reason: values?.ban_reason,
        };

        mutate(finalOut, {
            onSuccess: () => {
                // Reset the form to initial values
                actions.setSubmitting(false);
            },
        });
    };

    return (
        <div>
            <Formik
                validationSchema={banUserSchema()}
                key={formKey}
                initialValues={initialValues}
                onSubmit={(values, actions) => {
                    handleSubmit(values, actions);
                }}
            >
                <Form>
                    <MainDataBanUser />
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
