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
import type { Country, FetchCountryData } from './types';
import imageError from '/assets/images/logo.png';

export default function Countries() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.countries.title') },
    ];

    const [countryId, setCountryId] = useState<Object>('');
    const [page, setPage] = useState(1);

    const columns: MRT_ColumnDef<Country>[] = [
        {
            header: '#',
            Cell: ({ row }: { row: { index: number } }) => row.index + 1,
            size: 40,
        },
        {
            header: t('labels.image'),
            Cell: ({ row }: { row: { original: Country } }) => (
                <div className="flex gap-5">
                    <LightBox
                        getItems={[
                            {
                                src: row.original.image || imageError,
                            },
                        ]}
                    />
                </div>
            ),
            accessorKey: 'image',
        },

        {
            header: t('labels.name'),
            Cell: ({ row }: { row: { original: Country } }) => {
                const name = row.original.name || '---';
                return <span>{name}</span>;
            },
            accessorKey: 'name',
        },

        {
            header: t('labels.short_name'),
            Cell: ({ row }: { row: { original: Country } }) => {
                const short_name = row.original.short_name || '---';
                return <span>{short_name}</span>;
            },
            accessorKey: 'short_name',
        },

        {
            header: t('labels.phone_code'),
            Cell: ({ row }: { row: { original: Country } }) => {
                const phone_code = row.original.phone_code || '---';
                return <span>{phone_code}</span>;
            },
            accessorKey: 'phone_code',
        },

        {
            header: t('labels.phone_limit'),
            Cell: ({ row }: { row: { original: Country } }) => {
                const phone_limit = row.original.phone_limit || '---';
                return <span>{phone_limit}</span>;
            },
            accessorKey: 'phone_limit',
        },

        {
            header: t('labels.currency'),
            Cell: ({ row }: { row: { original: Country } }) => {
                const currency = row.original.currency || '---';
                return <span>{currency}</span>;
            },
            accessorKey: 'currency',
        },

        ...(hasPermission('country.index') || hasPermission('country.destroy')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ row }: { row: { original: Country } }) => (
                          <div
                              className="flex gap-2 items-center"
                              style={{ marginInlineStart: '1rem' }}
                          >
                              {hasPermission('country.index') && (
                                  <Link
                                      to={`/countries/edit/${row.original.id}`}
                                      className="flex gap-5"
                                  >
                                      <FaRegEdit className="text-[19px] text-warning ms-8" />
                                  </Link>
                              )}

                              {hasPermission('country.destroy') && (
                                  <CrudIconDelete
                                      deleteAction={() => {
                                          setCountryId(row.original.id);
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
    const endpoint = `country?${searchParams.toString()}`;

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchCountryData>({
        endpoint: endpoint,
        queryKey: [endpoint],
    });

    const { mutate: Delete } = useMutate({
        mutationKey: [`country/${countryId}`],
        endpoint: `country/${countryId}`,

        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', { name: t('labels.country') }),
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
            <Breadcrumb items={breadcrumbItems} />

            <TableCompCustom
                showOnly={true}
                columns={columns}
                data={terms?.data || []}
                paginationData={terms?.meta || []}
                title={t('breadcrumb.countries.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        {hasPermission('country.store') && (
                            <Link
                                to="/countries/add"
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
