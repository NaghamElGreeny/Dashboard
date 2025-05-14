import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../../hooks/UseFetch';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import MainDataCategories from './MainData';
import * as Yup from 'yup';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { isArabic, isEnglish } from '../../../helper/helpers';

export default function UpdateCategory() {
    const { t } = useTranslation();

    const { id } = useParams();
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.categories.title'), to: '/categories/index' },
        { label: t('breadcrumb.categories.edit') },
    ];
    const [formKey, setFormKey] = useState(0);

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `category/${id}`,
        queryKey: [`category/${id}`],
    });

    useEffect(() => {
        setFormKey(formKey + 1);
    }, [showDataSuccess]);

    const initialValues = {
        image: showData?.data?.image || '',

        ar_title: showData?.data?.ar?.title || '',

        en_title: showData?.data?.en?.title || '',

        subcategory_ids: showData?.data?.subcategories?.map((item: any) => item.id) || [],
    };

    const categorySchema = () =>
        Yup.object().shape({
            ar_title: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.name') + t('inArabic') }))
                .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value)),

            en_title: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.name') + t('inEnglish') }))
                .test('is-english', t('validations.englishText'), (value) => isEnglish(value)),

            subcategory_ids: Yup.array()
                .min(1, t('requiredField', { field: t('labels.sub_categories') }))
                .required(t('requiredField', { field: t('labels.sub_categories') })),
        });

    // update data
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`category/${id}`],
        endpoint: `category/${id}`,

        onSuccess: (data: any) => {
            // notify('success');
            refetch();
            navigate('/categories/index');
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
        const formattedSubCategoryIds: any = {};

        values?.subcategory_ids?.forEach((id: number, index: number) => {
            formattedSubCategoryIds[`subcategory_ids[${index}]`] = id;
        });

        const finalOut = {
            image: values?.image,

            ar: {
                name: values?.ar_title,
            },
            en: {
                name: values?.en_title,
            },

            ...formattedSubCategoryIds,
        };

        if (initialValues?.image == finalOut.image) {
            delete finalOut.image;
        }

        update({
            ...finalOut,
            //  _method: 'put'
        });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                validationSchema={categorySchema()}
                key={formKey}
                initialValues={initialValues}
                onSubmit={(values: any) => {
                    handleSubmit(values);
                }}
            >
                <Form>
                    <MainDataCategories isLoading={showDataLoading} />
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
