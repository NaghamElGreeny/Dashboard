import { Form, Formik } from 'formik';
import { useState, Dispatch, SetStateAction } from 'react';

import { useTranslation } from 'react-i18next';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import MainDataReply from './MainData';
import * as Yup from 'yup';

type AddReply_TP = {
    refetch: () => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
    dataInfo: any;
};

export default function AddReply({ setOpen, refetch, dataInfo }: AddReply_TP) {
    const { t } = useTranslation();

    const [formKey, setFormKey] = useState(0);
    const initialValues = {
        reply: '',
    };

    const addReplySchema = () =>
        Yup.object().shape({
            reply: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.reply') })),
        });

    const { mutate, isLoading } = useMutate({
        mutationKey: [`contacts/${dataInfo}/reply`],
        endpoint: `contacts/${dataInfo}/reply`,
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isCreatedSuccessfully', { name: t('breadcrumb.contact_messages.title') }),
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
        mutate(values, {
            onSuccess: () => {
                // Reset the form to initial values
                actions.setSubmitting(false);
            },
        });
    };

    return (
        <div>
            <Formik
                validationSchema={addReplySchema()}
                key={formKey}
                initialValues={initialValues}
                onSubmit={(values, actions) => {
                    handleSubmit(values, actions);
                }}
            >
                <Form>
                    <MainDataReply />
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
