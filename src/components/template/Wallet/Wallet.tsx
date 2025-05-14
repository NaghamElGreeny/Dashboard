import { Form, Formik } from 'formik';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import MainDataWallet from './MainData';

type Wallet_TP = {
    refetch: () => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
    type?: any;
    dataInfo?: any;
};

export default function Wallet({ setOpen, refetch, dataInfo, type }: Wallet_TP) {
    const { t } = useTranslation();

    const [formKey, setFormKey] = useState(0);
    const initialValues = {
        value: '',
        type: '',
        // user_id: '',
    };

    const walletSchema = () =>
        Yup.object().shape({
            type: Yup.string().required(t('requiredField', { field: t('labels.type') })),

            value: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.amountMoney') })),
        });

    const { mutate, isLoading } = useMutate({
        mutationKey: [`wallet/${dataInfo}`],
        endpoint: `wallet/${dataInfo}`,
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isCreatedSuccessfully', { name: t('breadcrumb.wallet.title') }),
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
            // user_id: dataInfo,
            type: values?.type,
            value: values?.value,
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
                validationSchema={walletSchema()}
                key={formKey}
                initialValues={initialValues}
                onSubmit={(values, actions) => {
                    handleSubmit(values, actions);
                }}
            >
                <Form>
                    <MainDataWallet
                    // userType={type}
                    />
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
