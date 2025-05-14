import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye, FaPlus, FaRegEdit } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import FilterSection from '../../components/atoms/filters/Filters';
import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import CrudIconDelete from '../../components/molecules/CrudIconDelete';
import LightBox from '../../components/molecules/LightBox/LightBox';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';
import { useMutate } from '../../hooks/UseMutate';
import type { FetchUsersData, User } from './types';
import { hasPermission } from '../../helper/permissionHelpers';
import Switcher from '../../components/molecules/Switcher';

export default function Users() {
    const { t } = useTranslation();

    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState<number>(1);

    const [userId, setUserId] = useState<string | null>(null);

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.users.title') },
    ];

    const statusList = [
        { id: 0, value: 'active', label: t('status.active') },
        { id: 1, value: 'inactive', label: t('status.inactive') },
    ];

    const columns: MRT_ColumnDef<User>[] = [
        {
            header: '#',
            Cell: ({ row }: { row: { index: number } }) => row.index + 1,
            size: 40,
        },
        {
            header: t('labels.image'),
            Cell: ({ row }: { row: { original: User } }) => (
                <div className="flex gap-5">
                    <LightBox
                        getItems={[
                            {
                                src: row.original.image,
                                // title: row.original.image,
                            },
                        ]}
                    />
                </div>
            ),
            accessorKey: 'image',
        },
        {
            header: t('labels.name'),
            Cell: ({ row }: { row: { original: User } }) => {
                const name = row.original.name || '---';
                return <span>{name}</span>;
            },
            accessorKey: 'name',
        },
        {
            accessorKey: 'phone',
            header: t('labels.phone'),
            Cell: ({ row }: { row: { original: User } }) => (
                <span>{row.original?.phone_complete_form || '---'}</span>
            ),
        },

        {
            accessorKey: 'date_of_birth',
            header: t('labels.date_of_birth'),
            Cell: ({ row }: { row: { original: User } }) => {
                const date_of_birth = row.original.date_of_birth || t('not_found');
                return <span>{date_of_birth}</span>;
            },
        },

        {
            accessorKey: 'gender',
            header: t('labels.gender'),
            Cell: ({ row }: { row: { original: User } }) => {
                const gender = row.original.gender || t('not_found');
                return <span>{t(`labels.${gender}`)}</span>;
            },
        },

        {
            accessorKey: 'email',
            header: t('labels.email'),
            Cell: ({ row }: { row: { original: User } }) => {
                const email = row.original.email || t('not_found');
                return <span>{email}</span>;
            },
        },

        {
            accessorKey: 'country',
            header: t('labels.country'),
            Cell: ({ row }: { row: { original: User } }) => {
                const country = row.original.country?.name || '---';
                return <span>{country}</span>;
            },
        },

        {
            accessorKey: 'status',
            header: t('labels.status'),
            Cell: ({ row }: { row: { original: User } }) => {
                const status = row.original.is_active ? t('labels.active') : t('labels.inactive');
                return (
                    <span className={`${row.original.is_active ? 'active' : 'inactive'} statuses`}>
                        {status}
                    </span>
                );
            },
        },

        ...(hasPermission('banUser-Client')
            ? [
                  {
                      accessorKey: 'is_ban',
                      header: t('labels.ban_status'),
                      Cell: ({ row }: { row: { original: User } }) => {
                          return (
                              <Switcher
                                  label={
                                      row.original?.is_ban ? t('labels.ban') : t('labels.un_ban')
                                  }
                                  checked={!row.original?.is_ban}
                                  onChange={() => {
                                      const newStatus = row.original?.is_ban === true ? 0 : 1;

                                      setUserId(row.original?.id);
                                      changeBan(newStatus);
                                  }}
                              />
                          );
                      },
                  },
              ]
            : []),

        {
            header: t('labels.actions'),
            Cell: ({ row }: { row: { original: User } }) => (
                <div className="flex gap-2 items-center ms-1">
                    <Link to={`/users/show/${row.original?.id}`} className="flex gap-5">
                        <FaEye className="text-[19px] text-[#50cd89] ms-8" />
                    </Link>

                    <Link to={`/users/edit/${row.original?.id}`} className="flex gap-5 ">
                        <FaRegEdit className="text-[19px] text-warning ms-8" />
                    </Link>

                    <CrudIconDelete
                        deleteAction={() => {
                            setUserId(row.original?.id || '');
                            deleteItem();
                        }}
                    />
                </div>
            ),
            accessorKey: 'actions',
        },
    ];

    const { mutate: ChangeBanMutate } = useMutate({
        mutationKey: [`toggle-ban-user/${userId}`],
        endpoint: `toggle-ban-user/${userId}`,
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title: t('status_changed_successfully'),
            });

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

    const changeBan = (newStatus: any) => {
        showAlert(
            t('toggle_status_confirmation'),
            '',
            false,
            t('ok'),
            true,
            'warning',
            () => ChangeBanMutate({ is_ban: newStatus, _method: 'patch' })
            // () => ChangeBanMutate({ is_ban: newStatus })
        );
    };

    const initialValues = {
        keyword: searchParams.get('keyword') || '',
        is_ban: searchParams.get('is_ban') || '',
        is_active: searchParams.get('is_active') || '',
    };

    const buildEndpoint = (params: { keyword: string; is_ban: any; is_active: string }) => {
        const queryParams = new URLSearchParams({ ...params, page: page.toString() });
        return `users?${queryParams.toString()}`;
    };

    const deleteItem = () => {
        showAlert(t('delete_confirmation'), '', false, t('ok'), true, 'warning', () => Delete({}));
    };

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchUsersData>({
        endpoint: buildEndpoint(initialValues),
        queryKey: [buildEndpoint(initialValues)],
    });

    const { mutate: Delete } = useMutate({
        mutationKey: [`users/${userId}`],
        endpoint: `users/${userId}`,
        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', { name: t('breadcrumb.users.title') }),
            });
            refetch();
        },
        onError: async (err: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'error',
                title: err?.response?.data?.message,
            });
        },
        formData: true,
        method: 'delete',
    });

    const handleReset = (
        resetForm: () => void,
        setFieldValue: (field: string, value: any) => void
    ) => {
        // Clear search params
        setSearchParams({});
        // Reset form values in Formik
        resetForm();
        // Explicitly reset the type field
        setFieldValue('is_active', '');
    };

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />

            {/* filter section */}
            <FilterSection
                initialValues={initialValues}
                optionsList={statusList}
                onSubmit={(values) => {
                    const params = {
                        keyword: values.keyword,
                        is_ban: values.is_ban,
                        is_active: values.is_active,
                    };
                    setSearchParams(params);
                }}
                onReset={handleReset}
                isLoading={isLoading}
                keywords={['keyword']}
                selectKeys={['is_active']}
            />

            <TableCompCustom
                showOnly={true}
                columns={columns}
                data={terms?.data || []}
                paginationData={terms?.meta || []}
                title={t('breadcrumb.users.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        <Link
                            to="/users/add"
                            className="bg-gradient-to-r from-primary to-secondary p-2 px-5 text-white font-semibold rounded-[0.25rem]"
                        >
                            <div className="flex items-center gap-2">
                                <FaPlus />
                                <span>{t('buttons.add')}</span>
                            </div>
                        </Link>
                    </>
                }
            />
        </>
    );
}
