import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye, FaRegEdit } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import LightBox from '../../components/molecules/LightBox/LightBox';
import Switcher from '../../components/molecules/Switcher';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import { hasPermission } from '../../helper/permissionHelpers';
import useFetch from '../../hooks/UseFetch';
import { useMutate } from '../../hooks/UseMutate';
import type { FetchProvidersData, Provider } from './types';
import CrudIconDelete from '../../components/molecules/CrudIconDelete';
import FilterSection from '../../components/atoms/filters/Filters';

export default function Providers() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.providers.title') },
    ];

    const [providerId, setProviderId] = useState<Object>('');
    const [page, setPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();

    const columns: MRT_ColumnDef<Provider>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },
        {
            header: t('labels.image'),
            Cell: ({ row }: { row: { original: Provider } }) => (
                <div className="flex gap-5">
                    <LightBox
                        getItems={[
                            {
                                src: row.original?.image,
                                // title: row.original?.full_name,
                            },
                        ]}
                    />
                </div>
            ),
            accessorKey: 'image',
        },

        {
            header: t('labels.full_name'),
            Cell: ({ row }: { row: { original: Provider } }) => {
                const full_name = row.original?.full_name || t('not_found');
                return <span>{full_name}</span>;
            },
            accessorKey: 'full_name',
        },

        {
            header: t('labels.email'),
            Cell: ({ row }: { row: { original: Provider } }) => {
                const email = row.original?.email || t('not_found');
                return <span>{email}</span>;
            },
            accessorKey: 'email',
        },

        {
            header: t('labels.university'),
            Cell: ({ row }: { row: { original: Provider } }) => {
                const university = row.original.university || t('not_found');
                return <span>{university}</span>;
            },
            accessorKey: 'university',
        },

        {
            header: t('labels.work_experience'),
            Cell: ({ row }: { row: { original: Provider } }) => {
                return <span>{row.original?.work_experience || t('not_found')}</span>;
            },
            accessorKey: 'work_experience',
        },

        {
            header: t('labels.license_number'),
            Cell: ({ row }: { row: { original: Provider } }) => {
                const license_number = row.original.license_number || t('not_found');
                return <span>{license_number}</span>;
            },
            accessorKey: 'license_number',
        },

        {
            header: t('labels.medical_associations'),
            Cell: ({ row }: { row: { original: Provider } }) => {
                const medical_associations = row.original.medical_associations;
                return <span>{medical_associations}</span>;
            },
            accessorKey: 'medical_associations',
        },

        {
            header: t('labels.scientific_experience'),
            Cell: ({ row }: { row: { original: Provider } }) => {
                const scientific_experience = row.original.scientific_experience;
                return <span>{scientific_experience}</span>;
            },
            accessorKey: 'scientific_experience',
        },

        ...(hasPermission('provider.toggle')
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
                                      setProviderId(row.original?.id);
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

        ...(hasPermission('provider.toggleBan')
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

                                      setProviderId(row.original?.id);
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

        ...(hasPermission('provider.update') ||
        hasPermission('provider.destroy') ||
        hasPermission('provider.show')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ row }: any) => (
                          <div className="flex gap-2 items-center ms-1">
                              {hasPermission('provider.show') && (
                                  <Link
                                      to={`/providers/show/${row.original.id}`}
                                      className="flex gap-5"
                                  >
                                      <FaEye className="text-[19px] text-[#50cd89] ms-8" />
                                  </Link>
                              )}

                              {hasPermission('provider.update') && (
                                  <Link
                                      to={`/providers/edit/${row.original.id}`}
                                      className="flex gap-5"
                                  >
                                      <FaRegEdit className="text-[19px] text-warning ms-8" />
                                  </Link>
                              )}

                              {hasPermission('provider.destroy') && (
                                  <CrudIconDelete
                                      deleteAction={() => {
                                          setProviderId(row.original?.id);
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

    const { mutate: Delete } = useMutate({
        mutationKey: [`provider/${providerId}`],
        endpoint: `provider/${providerId}`,

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

    const deleteItem = () => {
        showAlert(t('delete_confirmation'), '', false, t('ok'), true, 'warning', () => Delete({}));
    };
    const { mutate: ChangeActiveMutate } = useMutate({
        mutationKey: [`provider/toggle-active/${providerId}`],
        endpoint: `provider/toggle-active/${providerId}`,
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
        mutationKey: [`provider/toggle-ban/${providerId}`],
        endpoint: `provider/toggle-ban/${providerId}`,
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
        provider_name: searchParams.get('provider_name') || '',
    };

    const buildEndpoint = (params: { provider_name: string }) => {
        const queryParams = new URLSearchParams({ ...params, page: page.toString() });

        return `provider?${queryParams.toString()}`;
    };

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchProvidersData>({
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
                        provider_name: values.provider_name,
                    };
                    setSearchParams(params);
                }}
                onReset={handleReset}
                isLoading={isLoading}
                keywords={['provider_name']}
            />

            <TableCompCustom
                showOnly={true}
                columns={columns}
                data={terms?.data || []}
                paginationData={terms?.meta || []}
                title={t('breadcrumb.providers.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
            />
        </>
    );
}
