import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useFetch from '../../../hooks/UseFetch';
import { useMutate } from '../../../hooks/UseMutate';
// import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';

export default function WhyUsEdit() {
    const { t } = useTranslation();
    const { id } = useParams();

    const { data, isLoading } = useFetch<any>({
        endpoint: `why-us/${id}`,
        queryKey: [`why-us/${id}`],
    });

    const { mutate: updateWhyUs } = useMutate({
        mutationKey: [`why-us/${id}`],
        endpoint: `why-us/${id}`,
        method: 'post',
        formData: true,
        onSuccess: (res) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.message ||
                    t('isEditSuccessfully', { name: t('breadcrumb.about.title') }),
            });
            // showAlert(t('updated_successfully'), '', true);
        },
        onError: (err) => {
            ShowAlertMixin({
                type: 15,
                icon: 'error',
                title: data?.message,
            });
            // showAlert(t('error_occurred'), err?.response?.data?.message || '', true, 'error');
        },
    });

    const validationSchema = Yup.object({
        value: Yup.string().required(t('validation.required')),
        description: Yup.string().required(t('validation.required')),
        icon: Yup.mixed()
            .nullable()
            .test('fileType', t('validation.image_only'), (value) => {
                if (!value) return true;
                return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
            }),
    });

    const formik = useFormik({
        initialValues: {
            value: '',
            description: '',
            icon: null,
        },
        validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append('value', values.value);
            formData.append('description', values.description);
            if (values.icon) formData.append('icon', values.icon);

            updateWhyUs(formData);
        },
        enableReinitialize: true,
    });

    useEffect(() => {
        if (data?.data) {
            formik.setValues({
                value: data.data.value || '',
                description: data.data?.en?.key || '',
                icon: null,
            });
        }
    }, [data]);

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4 max-w-lg mx-auto">
            <div>
                <label className="block mb-1">{t('labels.title')}</label>
                <input
                    type="text"
                    name="value"
                    className="w-full border p-2 rounded"
                    value={formik.values.value}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.value && formik.errors.value && (
                    <div className="text-red-500">{formik.errors.value}</div>
                )}
            </div>

            <div>
                <label className="block mb-1">{t('labels.description')}</label>
                <textarea
                    name="description"
                    className="w-full border p-2 rounded"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.description && formik.errors.description && (
                    <div className="text-red-500">{formik.errors.description}</div>
                )}
            </div>

            <div>
                <label className="block mb-1">{t('labels.image')}</label>
                <input
                    type="file"
                    name="icon"
                    accept="image/*"
                    onChange={(event) => {
                        formik.setFieldValue('icon', event.currentTarget.files?.[0] || null);
                    }}
                />
                {formik.errors.icon && (
                    <div className="text-red-500">{formik.errors.icon}</div>
                )}
            </div>

            {/* Show current image */}
            {data?.data?.icon?.url && (
                <div className="mt-2">
                    <img
                        src={data.data.icon.url}
                        alt="Current icon"
                        className="w-24 h-24 object-cover rounded"
                    />
                </div>
            )}

            <button
                type="submit"
                className="mt-4 bg-primary text-white py-2 px-4 rounded"
                disabled={formik.isSubmitting}
            >
                {t('buttons.update')}
            </button>
        </form>
    );
}
