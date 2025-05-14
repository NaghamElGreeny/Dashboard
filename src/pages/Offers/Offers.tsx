import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaRegEdit } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import FilterSection from '../../components/atoms/filters/Filters';
import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import CrudIconDelete from '../../components/molecules/CrudIconDelete';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import { hasPermission } from '../../helper/permissionHelpers';
import useFetch from '../../hooks/UseFetch';
import { useMutate } from '../../hooks/UseMutate';
import type { FetchData, Offer } from './types';

export default function Offers() {
    const { t, i18n } = useTranslation();

    const [offerId, setOfferId] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [searchParams, setSearchParams] = useSearchParams();

    const columns: MRT_ColumnDef<Offer>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.type'),
            Cell: ({ row }: { row: { original: Offer } }) => {
                const type = row.original?.type;
                return <span>{t(`labels.${type}`)}</span>;
            },
            accessorKey: 'type',
        },

        {
            header: t('labels.start_date'),
            Cell: ({ row }: { row: { original: Offer } }) => {
                const start_at = row.original?.start_at || '---';
                return <span>{start_at}</span>;
            },
            accessorKey: 'start_at',
        },

        {
            header: t('labels.end_date'),
            Cell: ({ row }: { row: { original: Offer } }) => {
                const end_at = row.original?.end_at || '---';
                return <span>{end_at}</span>;
            },
            accessorKey: 'end_at',
        },

        {
            header: t('labels.created_at'),
            Cell: ({ row }: { row: { original: Offer } }) => {
                const created_at = row.original?.created_at || '---';
                return <span>{created_at}</span>;
            },
            accessorKey: 'created_at',
        },

        {
            accessorKey: 'status',
            header: t('labels.status'),
            Cell: ({ row }: { row: { original: Offer } }) => {
                const status = row.original?.is_active ? t('labels.active') : t('labels.inactive');
                return (
                    <>
                        <span
                            className={`${
                                row.original?.is_active ? 'active' : 'inactive'
                            } statuses `}
                        >
                            {status}
                        </span>
                    </>
                );
            },
        },

        ...(hasPermission('update-Offer') || hasPermission('delete-Offer')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ row }: any) => (
                          <div
                              className="flex gap-2 items-center"
                              style={{ marginInlineStart: '1rem' }}
                          >
                              {hasPermission('update-Offer') && (
                                  <Link
                                      to={`/offers/edit/${row.original?.id}`}
                                      className="flex gap-5"
                                  >
                                      <FaRegEdit className="text-[19px] text-warning ms-8" />
                                  </Link>
                              )}

                              {hasPermission('delete-Offer') && (
                                  <CrudIconDelete
                                      deleteAction={() => {
                                          setOfferId(row.original?.id);
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

    const initialValues = {
        start_at: searchParams.get('start_at') || '',
        end_at: searchParams.get('end_at') || '',
        type: 'offer',
    };

    const buildEndpoint = (params: { start_at: string; end_at: string; type: string }) => {
        const queryParams = new URLSearchParams({ ...params, page: page.toString() });

        return `offers?${queryParams.toString()}`;
    };

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchData>({
        endpoint: buildEndpoint(initialValues),
        queryKey: [buildEndpoint(initialValues)],
    });

    const handleReset = (resetForm: () => void) => {
        // Keep current URL parameters while resetting the form
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.delete('start_at'); // Remove specific parameter
        currentParams.delete('end_at'); // Remove specific parameter
        // Ensure type remains 'offer'
        currentParams.set('type', 'offer');
        setSearchParams(currentParams);
        resetForm();
    };

    const { mutate: Delete } = useMutate({
        mutationKey: [`offers/${offerId}`],
        endpoint: `offers/${offerId}`,
        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message || t('isDeletedSuccessfully', { name: t('labels.offer') }),
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

    return (
        <>
            {/* filter section */}
            <FilterSection
                initialValues={initialValues}
                onSubmit={(values) => {
                    const params = {
                        start_at: values.start_at,
                        end_at: values.end_at,
                        type: values.type,
                    };
                    setSearchParams(params);
                }}
                onReset={handleReset}
                isLoading={isLoading}
                startDateName="start_at"
                endDateName="end_at"
            />

            <TableCompCustom
                showOnly={true}
                columns={columns}
                data={terms?.data || []}
                paginationData={terms?.meta || []}
                title={t('breadcrumb.offers.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        {hasPermission('store-Offer') && (
                            <Link
                                to="/offers/add"
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
