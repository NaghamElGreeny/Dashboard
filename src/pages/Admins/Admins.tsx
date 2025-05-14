import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaRegEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import CrudIconDelete from '../../components/molecules/CrudIconDelete';
import LightBox from '../../components/molecules/LightBox/LightBox';
import Switcher from '../../components/molecules/Switcher';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';
import { useMutate } from '../../hooks/UseMutate';
import { Admin, FetchData } from './types';
import { useIsRTL } from '../../hooks/useIsRTL';
import { hasPermission } from '../../helper/permissionHelpers';

export default function Admins() {
    const { t } = useTranslation();

    const [page, setPage] = useState<number>(1);
    const rtl = useIsRTL();

    const [adminId, setAdminId] = useState<string | null>(null);

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.admins.title') },
    ];

    const columns: MRT_ColumnDef<Admin>[] = [
        {
            header: '#',
            Cell: ({ row }: { row: { index: number } }) => row.index + 1,
            size: 40,
        },
        {
            header: t('labels.image'),
            Cell: ({ row }: { row: { original: Admin } }) => (
                <div className="flex gap-5">
                    <LightBox
                        getItems={[
                            {
                                src: row.original?.image,
                                // title: row.original?.image,
                            },
                        ]}
                    />
                </div>
            ),
            accessorKey: 'image',
        },

        {
            header: t('labels.full_name'),
            Cell: ({ row }: { row: { original: Admin } }) => {
                const full_name = row.original?.full_name || t('not_found');
                return <span>{full_name}</span>;
            },
            accessorKey: 'full_name',
        },

        {
            header: t('labels.email'),
            Cell: ({ row }: { row: { original: Admin } }) => {
                const email = row.original?.email || t('not_found');
                return <span>{email}</span>;
            },
            accessorKey: 'email',
        },

        {
            header: t('labels.role'),
            Cell: ({ row }: { row: { original: Admin } }) => {
                const role = row.original?.role?.name || t('not_found');
                return <span>{role}</span>;
            },
            accessorKey: 'role',
        },

        ...(hasPermission('admin.toggle')
            ? [
                {
                    accessorKey: 'is_active',
                    header: t('labels.status'),
                    Cell: ({ row }: { row: { original: Admin } }) => {
                        return (
                            <Switcher
                                label={
                                    row.original?.is_active
                                        ? t('labels.active')
                                        : t('labels.inactive')
                                }
                                checked={row.original?.is_active}
                                onChange={() => {
                                    const newStatus = row.original?.is_active === true ? 0 : 1;
                                    setAdminId(row.original?.id);
                                    changeActive(newStatus);
                                }}
                            />
                        );
                    },
                },
            ]
            : [
                {
                    accessorKey: 'is_active',
                    header: t('labels.status'),
                    Cell: ({ row }: any) => (
                        <span
                            className={`${row?.original?.is_active ? 'active' : 'inactive'
                                } statuses`}
                        >
                            {row?.original?.is_active ? t('labels.active') : t('labels.inactive')}
                        </span>
                    ),
                },
            ]),

        ...(hasPermission('admin.update') || hasPermission('admin.update')
            ? [
                {
                    header: t('labels.actions'),
                    Cell: ({ row }: { row: { original: Admin } }) => (
                        <div className="flex gap-2 items-center ms-1">
                            {hasPermission('admin.update') && (
                                <Link
                                    to={`/admins/edit/${row.original?.id}`}
                                    className="flex gap-5 "
                                >
                                    <FaRegEdit className="text-[19px] text-warning ms-8" />
                                </Link>
                            )}

                            {hasPermission('admin.update') && (
                                <CrudIconDelete
                                    deleteAction={() => {
                                        setAdminId(row.original?.id || '');
                                        deleteItem();
                                    }}
                                />
                            )}
                        </div>
                    ),
                    accessorKey: 'actions',
                },
            ]
            : []),
    ];

    const queryParams = {
        page: page,
    };

    const searchParams = new URLSearchParams(queryParams as any);
    const endpoint = `admin?${searchParams.toString()}`;

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchData>({
        endpoint: endpoint,
        queryKey: [endpoint],
    });

    const deleteItem = () => {
        showAlert(t('delete_confirmation'), '', false, t('ok'), true, 'warning', () => Delete({}));
    };

    const { mutate: Delete } = useMutate({
        mutationKey: [`admin/${adminId}`],
        endpoint: `admin/${adminId}`,
        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', { name: t('breadcrumb.admins.title') }),
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

    const { mutate: ChangeActiveMutate } = useMutate({
        mutationKey: [`admin/toggle-active/${adminId}`],
        endpoint: `admin/toggle-active/${adminId}`,
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

    const changeActive = (newStatus: any) => {
        showAlert(
            t('toggle_status_confirmation'),
            '',
            false,
            t('ok'),
            true,
            'warning',
            // () => ChangeActiveMutate({ is_admin_active: newStatus, _method: 'put' })
            () => ChangeActiveMutate({ is_active: newStatus, _method: 'patch' })
        );
    };

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />

            <TableCompCustom
                showOnly={true}
                columns={columns}
                data={terms?.data || []}
                paginationData={terms?.meta || []}
                title={t('breadcrumb.admins.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        {hasPermission('admin.store') && (
                            <Link
                                to="/admins/add"
                                className="bg-gradient-to-r from-primary to-secondary p-2 px-5 text-white font-semibold rounded-[0.25rem]"
                            >
                                <div className="flex items-center gap-2">
                                    <FaPlus />
                                    <span>{t('buttons.add')}</span>
                                </div>
                            </Link>
                        )}
                    </>
                }
            />
        </>
    );
}
