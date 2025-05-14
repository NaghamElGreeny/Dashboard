import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye, FaRegEdit } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import CrudIconDelete from '../../components/molecules/CrudIconDelete';
import Switcher from '../../components/molecules/Switcher';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import { hasPermission } from '../../helper/permissionHelpers';
import useFetch from '../../hooks/UseFetch';
import { useIsRTL } from '../../hooks/useIsRTL';
import { useMutate } from '../../hooks/UseMutate';
import type { Client, FetchClientData } from './types';
import FilterSection from '../../components/atoms/filters/Filters';

export default function Clients() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.clients.title') },
    ];

    const [clientId, setClientId] = useState<Object>('');
    const [page, setPage] = useState(1);
    const rtl = useIsRTL();
    const [searchParams, setSearchParams] = useSearchParams();

    const columns: MRT_ColumnDef<Client>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.name'),
            Cell: ({ row }: { row: { original: Client } }) => {
                const name = row.original?.full_name || '---';
                return <span>{name}</span>;
            },
            accessorKey: 'name',
        },

        {
            header: t('labels.email'),
            Cell: ({ row }: { row: { original: Client } }) => {
                const email = row.original?.email || '---';
                return <span>{email}</span>;
            },
            accessorKey: 'email',
        },

        {
            header: t('labels.birthdate'),
            Cell: ({ row }: { row: { original: Client } }) => {
                const birthdate = row.original?.birthdate || '---';
                return <span>{birthdate}</span>;
            },
            accessorKey: 'birthdate',
        },

        {
            header: t('labels.phone'),
            Cell: ({ row }: { row: { original: Client } }) => {
                return (
                    <>
                        {rtl ? (
                            <span>
                                {row.original?.phone} {row.original?.phone_code}
                            </span>
                        ) : (
                            <span>
                                {row.original?.phone_code} {row.original?.phone}
                            </span>
                        )}
                    </>
                );
            },
            accessorKey: 'phone',
        },

        ...(hasPermission('client.toggle')
            ? [
                  {
                      accessorKey: 'is_active',
                      header: t('labels.status'),
                      Cell: ({ row }: any) => {
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
                                      setClientId(row.original?.id);
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
                              className={`${
                                  row?.original?.is_active ? 'active' : 'inactive'
                              } statuses`}
                          >
                              {row?.original?.is_active ? t('labels.active') : t('labels.inactive')}
                          </span>
                      ),
                  },
              ]),

        ...(hasPermission('client.toggleBan')
            ? [
                  {
                      accessorKey: 'is_banned',
                      header: t('labels.ban_status'),
                      Cell: ({ row }: { row: { original: any } }) => {
                          return (
                              <Switcher
                                  label={
                                      row.original?.is_banned ? t('labels.ban') : t('labels.un_ban')
                                  }
                                  checked={!row.original?.is_banned}
                                  onChange={() => {
                                      const newStatus = row.original?.is_banned === true ? 0 : 1;

                                      setClientId(row.original?.id);
                                      changeBan(newStatus);
                                  }}
                              />
                          );
                      },
                  },
              ]
            : [
                  {
                      accessorKey: 'is_banned',
                      header: t('labels.ban_status'),
                      Cell: ({ row }: any) => (
                          <span
                              className={`${
                                  !row?.original?.is_banned ? 'active' : 'inactive'
                              } statuses`}
                          >
                              {row.original?.is_banned ? t('labels.ban') : t('labels.un_ban')}
                          </span>
                      ),
                  },
              ]),

        ...(hasPermission('client.destroy') || hasPermission('client.show')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ row }: any) => (
                          <div className="flex gap-2 items-center ms-1">
                              {hasPermission('client.show') && (
                                  <Link
                                      to={`/clients/show/${row.original.id}`}
                                      className="flex gap-5"
                                  >
                                      <FaEye className="text-[19px] text-[#50cd89] ms-8" />
                                  </Link>
                              )}
                              {hasPermission('client.destroy') && (
                                  <CrudIconDelete
                                      deleteAction={() => {
                                          setClientId(row.original?.id);
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

    const deleteItem = () => {
        showAlert(t('delete_confirmation'), '', false, t('ok'), true, 'warning', () => Delete({}));
    };

    const { mutate: Delete } = useMutate({
        mutationKey: [`client/${clientId}`],
        endpoint: `client/${clientId}`,

        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', { name: t('breadcrumb.clients.title') }),
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
        mutationKey: [`client/toggle-active/${clientId}`],
        endpoint: `client/toggle-active/${clientId}`,
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
        showAlert(t('toggle_status_confirmation'), '', false, t('ok'), true, 'warning', () =>
            ChangeActiveMutate({ is_active: newStatus })
        );
    };

    const { mutate: ChangeBanMutate } = useMutate({
        mutationKey: [`client/toggle-ban/${clientId}`],
        endpoint: `client/toggle-ban/${clientId}`,
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
        showAlert(t('toggle_status_confirmation'), '', false, t('ok'), true, 'warning', () =>
            ChangeBanMutate({ is_banned: newStatus })
        );
    };

    const initialValues = {
        client_name: searchParams.get('client_name') || '',
    };

    const buildEndpoint = (params: { client_name: string }) => {
        const queryParams = new URLSearchParams({ ...params, page: page.toString() });

        return `client?${queryParams.toString()}`;
    };

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchClientData>({
        endpoint: buildEndpoint(initialValues),
        queryKey: [buildEndpoint(initialValues)],
    });

    const handleReset = (resetForm: () => void) => {
        setSearchParams({});
        resetForm();
    };

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />

            {/* filter section */}
            <FilterSection
                initialValues={initialValues}
                onSubmit={(values) => {
                    const params = {
                        client_name: values.client_name,
                    };
                    setSearchParams(params);
                }}
                onReset={handleReset}
                isLoading={isLoading}
                keywords={['client_name']}
            />

            <TableCompCustom
                showOnly={true}
                columns={columns}
                data={terms?.data || []}
                paginationData={terms?.meta || []}
                title={t('breadcrumb.clients.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
            />
        </>
    );
}
