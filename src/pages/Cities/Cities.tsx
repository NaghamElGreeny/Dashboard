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
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import { hasPermission } from '../../helper/permissionHelpers';
import useFetch from '../../hooks/UseFetch';
import { useMutate } from '../../hooks/UseMutate';
import type { City, FetchCityData } from './types';
import imageError from '/public/assets/images/logo.png';

export default function Cities() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.cities.title') },
    ];

    const [page, setPage] = useState(1);
    const [cityId, setCityId] = useState<Object>('');

    const columns: MRT_ColumnDef<City>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.image'),
            Cell: ({ row }: { row: { original: City } }) => (
                <div className="flex gap-5 ">
                    <LightBox
                        getItems={[
                            {
                                src: row.original.image || imageError,
                                // title: row.original.name,
                            },
                        ]}
                    />
                </div>
            ),
            accessorKey: 'image',
        },

        {
            header: t('labels.name'),
            Cell: ({ row }: { row: { original: City } }) => {
                const name = row.original?.name || t('not_found');
                return <span>{name}</span>;
            },
            accessorKey: 'name',
        },

        {
            header: t('labels.country'),
            Cell: ({ row }: { row: { original: City } }) => {
                const name = row.original?.country?.name || '---';
                return <span>{name}</span>;
            },
            accessorKey: 'country',
        },

        {
            header: t('labels.postal_code'),
            Cell: ({ row }: { row: { original: City } }) => {
                const postal_code = row.original?.postal_code || '---';
                return <span>{postal_code}</span>;
            },
            accessorKey: 'postal_code',
        },

        {
            header: t('labels.location'),
            Cell: ({ row }: { row: { original: City } }) => {
                const location = row.original?.location_data?.location || '---';
                return <span>{location}</span>;
            },
            accessorKey: 'location',
        },

        {
            header: t('labels.short_cut'),
            Cell: ({ row }: { row: { original: City } }) => {
                const short_cut = row.original?.short_cut || '---';
                return <span>{short_cut}</span>;
            },
            accessorKey: 'short_cut',
        },

        {
            accessorKey: 'offline_session_availability',
            header: t('labels.offline_session_availability'),
            Cell: ({ row }: { row: { original: City } }) => {
                const offline_session_availability = row.original?.offline_session_availability
                    ? t('yes')
                    : t('no');
                return (
                    <>
                        <span
                            className={`${
                                row.original?.offline_session_availability ? 'active' : 'inactive'
                            } statuses `}
                        >
                            {offline_session_availability}
                        </span>
                    </>
                );
            },
        },

        ...(hasPermission('city.index') || hasPermission('city.destroy')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ renderedCellValue, row }: any) => (
                          <div
                              className="flex gap-2 items-center"
                              style={{ marginInlineStart: '1rem' }}
                          >
                              {hasPermission('country.index') && (
                                  <Link
                                      to={`/cities/edit/${row.original?.id}`}
                                      className="flex gap-5 "
                                  >
                                      <FaRegEdit className="text-[19px] text-warning ms-8" />
                                  </Link>
                              )}

                              {hasPermission('city.destroy') && (
                                  <CrudIconDelete
                                      deleteAction={() => {
                                          setCityId(row.original?.id);
                                          deleteItem();
                                      }}
                                  />
                              )}
                          </div>
                      ),
                      accessorKey: 'x',
                  },
              ]
            : []),
    ];

    const deleteItem = () => {
        showAlert(t('delete_confirmation'), '', false, t('ok'), true, 'warning', () => Delete({}));
    };

    const queryParams = {
        page: page,
    };

    const searchParams = new URLSearchParams(queryParams as any);
    const endpoint = `city?${searchParams.toString()}`;

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchCityData>({
        endpoint: endpoint,
        queryKey: [endpoint],
    });

    const { mutate: Delete } = useMutate({
        mutationKey: [`city/${cityId}`],
        endpoint: `city/${cityId}`,

        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title: data?.data?.message || t('isDeletedSuccessfully', { name: t('Admins') }),
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
        mutationKey: [`cities/${cityId}/change_status`],
        endpoint: `cities/${cityId}/change_status`,
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
            // () => ChangeActiveMutate({ status: newStatus, _method: 'put' })
            () => ChangeActiveMutate({ status: newStatus })
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
                title={t('breadcrumb.cities.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        {hasPermission('city.store') && (
                            <Link
                                to="/cities/add"
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
