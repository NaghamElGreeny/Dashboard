import { useQueryClient } from '@tanstack/react-query';
import { Form, Formik } from 'formik';

import { Button } from '../../atoms';

import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { isArabic, isEnglish } from '../../../helper/helpers';
import useFetch from '../../../hooks/UseFetch';
import { useMutate } from '../../../hooks/UseMutate';
import Loading from '../../atoms/loading';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import { OuterFormLayout } from '../../molecules/OuterFormLayout';
import { RolesMainData } from './MainData';
import { useEffect } from 'react';

///
/////////// Types
///
type RolesFormProps_TP = {
    title: string;
    value?: string;
    onAdd?: (value: string) => void;
    editData?: any;
    Id?: string;
};

///
export const RolesForm = ({ title, value, onAdd, editData }: RolesFormProps_TP) => {
    const { t, i18n } = useTranslation();
    const { id } = useParams();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.roles.title'), to: '/roles/index' },
        { label: id ? t('breadcrumb.roles.edit') : t('breadcrumb.roles.add') },
    ];

    const navigate = useNavigate();
    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetchShow,
    } = useFetch<any>({
        endpoint: `role/${id}`,
        //@ts-ignore
        queryKey: [`showData`, id],
        enabled: !!id,
    });

    const {
        data: permissions,
        isError: permissionsError,
        isLoading: permissionsLoading,
        isSuccess: permissionsSuccess,
        failureReason,
        refetch,
        error,
    } = useFetch<any>({
        endpoint: `permission/list-without-pag`,
        queryKey: [`permission/list-without-pag`],
    });

    const queryClient = useQueryClient();

    const rolesSchema = () =>
        Yup.object({
            ar_name: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.name') + t('inArabic') }))
                .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value)),

            en_name: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.name') + t('inEnglish') }))
                .test('is-english', t('validations.englishText'), (value) => isEnglish(value)),
        });

    const initialPermissions = Array.isArray(showData?.data?.permission)
        ? showData?.data?.permission?.reduce((acc: Record<string, boolean>, permission: any) => {
              acc[permission.id] = true; // or any other value you need
              return acc;
          }, {})
        : {};

    const initialValues = {
        ar_name: showData?.data?.ar?.name || '',
        en_name: showData?.data?.en?.name || '',
        ...initialPermissions,
    };

    // mutate data
    const { mutate, isLoading } = useMutate({
        mutationKey: [`role`],
        endpoint: `role`,

        onSuccess: (data: any) => {
            // notify('success');

            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isCreatedSuccessfully', { name: t('breadcrumb.roles.title') }),
            });

            queryClient.refetchQueries(['allPermission']);
            // refetch();
            navigate('/roles/index');
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
    ///

    //
    // update data
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`role/${id}`],
        endpoint: `role/${id}`,

        onSuccess: (data: any) => {
            // notify('success');
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isEditSuccessfully', { name: t('breadcrumb.roles.title') }),
            });

            queryClient.refetchQueries(['allPermission']);
            refetch();
            refetchShow();
            navigate('/roles/index');
        },
        onError: (err: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'error',
                title: err?.response?.data?.message,
            });

            // notify('error', err);
        },

        formData: true,
    });

    return (
        <>
            {/* <title>{title}</title> */}

            {(id ? !!(showDataLoading || permissionsLoading) : permissionsLoading) && <Loading />}
            {permissionsError && (
                <p>
                    {
                        //@ts-ignore
                        error.message
                    }
                </p>
            )}
            {/* <Button
                type="button"
                variant="primary"
                className="mr-auto mt-8"
                action={() => navigate(-1)}
            >
                {t('buttons.back')}
            </Button> */}

            <Breadcrumb items={breadcrumbItems} />

            {(id ? !!(showDataSuccess && permissionsSuccess) : permissionsSuccess) && (
                <Formik
                    onSubmit={(values: any) => {
                        const updatedValues = { ...values };

                        // Extract current and new values for comparison
                        const nameArValue = updatedValues.ar_name;
                        const nameEnValue = updatedValues.en_name;

                        delete updatedValues.ar_name;
                        delete updatedValues.en_name;

                        // Prepare the permissions object
                        const updatedPermissions = {
                            ...Object.keys(updatedValues).reduce((acc, key, index) => {
                                const value = updatedValues[key];
                                if (value !== '' && value !== null && value !== undefined) {
                                    //@ts-ignore
                                    acc[`permission_ids[${index}]`] = key;
                                }
                                return acc;
                            }, {}),
                            ar: { name: nameArValue }, // Send the Arabic name
                            en: { name: nameEnValue }, // Send the English name
                        };

                        // Conditionally handle create vs. update
                        if (!id) {
                            mutate(updatedPermissions);
                        } else {
                            update({
                                ...updatedPermissions,
                                // _method: 'put'
                            });
                        }
                    }}
                    initialValues={initialValues}
                    validationSchema={rolesSchema()}
                >
                    {({ validateForm, values, touched }) => {
                        // Listen for language changes and revalidate
                        useEffect(() => {
                            validateForm();
                        }, [i18n.language]);

                        return (
                            <Form>
                                <OuterFormLayout
                                    submitComponent={
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            className="bg-primary text-white py-3 px-5 rounded-lg hover:bg-white hover:text-primary border hover:border-primary"
                                            loading={LoadingUpdate || isLoading}
                                        >
                                            {t('buttons.save')}
                                        </Button>
                                    }
                                >
                                    <RolesMainData
                                        isLoading={showDataLoading}
                                        permissions={permissions.data}
                                        showData={showData}
                                        editData={editData}
                                    />
                                </OuterFormLayout>
                            </Form>
                        );
                    }}
                </Formik>
            )}
        </>
    );
};
