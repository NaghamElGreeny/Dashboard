import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaRegEdit } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import CrudIconDelete from '../../components/molecules/CrudIconDelete';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import { hasPermission } from '../../helper/permissionHelpers';
import useFetch from '../../hooks/UseFetch';
import { useMutate } from '../../hooks/UseMutate';
import type { Coupon, FetchCouponData } from './types';
import FilterSection from '../../components/atoms/filters/Filters';
import Switcher from '../../components/molecules/Switcher';

export default function Coupons() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.coupons.title') },
    ];

    const [couponId, setCouponId] = useState<Object>('');
    const [page, setPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();

    const statusList = [
        { id: 0, value: 1, label: t('status.active') },
        { id: 1, value: 0, label: t('status.inactive') },
    ];

    const columns: MRT_ColumnDef<Coupon>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.code'),
            Cell: ({ row }: { row: { original: Coupon } }) => {
                return <span>{row?.original?.code || '---'}</span>;
            },
            accessorKey: 'code',
        },

        {
            accessorKey: 'type',
            header: t('labels.type'),
            Cell: ({ row }: { row: { original: Coupon } }) => {
                return (
                    <span>{row?.original?.type ? t(`labels.${row?.original?.type}`) : '---'}</span>
                );
            },
        },

        {
            accessorKey: 'value',
            header: t('labels.value'),
            Cell: ({ row }: { row: { original: Coupon } }) => {
                return <span>{row?.original?.value || '---'}</span>;
            },
        },

        {
            accessorKey: 'max_limit',
            header: t('labels.max_limit'),
            Cell: ({ row }: { row: { original: Coupon } }) => {
                return <span>{row?.original?.max_limit || 0}</span>;
            },
        },

        {
            accessorKey: 'user_limit',
            header: t('labels.usage_limit'),
            Cell: ({ row }: { row: { original: Coupon } }) => {
                return <span>{row?.original?.user_limit || 0}</span>;
            },
        },

        {
            accessorKey: 'start_date',
            header: t('labels.start_date'),
            Cell: ({ row }: { row: { original: Coupon } }) => {
                return (
                    <span>
                        {row?.original?.start_date} {row?.original?.start_time}
                    </span>
                );
            },
        },

        {
            accessorKey: 'end_date',
            header: t('labels.end_date'),
            Cell: ({ row }: { row: { original: Coupon } }) => {
                return (
                    <span>
                        {row?.original?.end_date} {row?.original?.end_time}
                    </span>
                );
            },
        },

        ...(hasPermission('coupon.toggle')
            ? [
                  {
                      accessorKey: 'is_active',
                      header: t('labels.status'),
                      Cell: ({ row }: { row: { original: Coupon } }) => {
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
                                      setCouponId(row.original?.id);
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
                      Cell: ({ row }: { row: { original: Coupon } }) => (
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

        ...(hasPermission('coupon.update') || hasPermission('coupon.destroy')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ renderedCellValue, row }: any) => (
                          <div
                              className="flex gap-2 items-center"
                              style={{ marginInlineStart: '1rem' }}
                          >
                              {hasPermission('coupon.update') && (
                                  <Link
                                      to={`/coupons/edit/${row?.original?.id}`}
                                      className="flex gap-5 "
                                  >
                                      <FaRegEdit className="text-[19px] text-warning ms-8" />
                                  </Link>
                              )}

                              {hasPermission('coupon.destroy') && (
                                  <CrudIconDelete
                                      deleteAction={() => {
                                          setCouponId(row?.original?.id);
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

    const { mutate: ChangeActiveMutate } = useMutate({
        mutationKey: [`coupon/toggle/${couponId}`],
        endpoint: `coupon/toggle/${couponId}`,
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
            // () => ChangeActiveMutate({ is_active: newStatus, _method: 'put' })
            () => ChangeActiveMutate({ is_active: newStatus })
        );
    };

    const { mutate: Delete } = useMutate({
        mutationKey: [`coupon/${couponId}`],
        endpoint: `coupon/${couponId}`,

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

    const deleteItem = () => {
        showAlert(t('delete_confirmation'), '', false, t('ok'), true, 'warning', () => Delete({}));
    };

    const initialValues = {
        start_date: searchParams.get('start_date') || '',
        end_date: searchParams.get('end_date') || '',
        coupon_code: searchParams.get('coupon_code') || '',
        status: searchParams.get('status') || '',
    };

    const buildEndpoint = (params: {
        start_date: string;
        end_date: string;
        coupon_code: string;
        status: string;
    }) => {
        const queryParams = new URLSearchParams({ ...params, page: page.toString() });

        return `coupon?${queryParams.toString()}`;
    };

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchCouponData>({
        endpoint: buildEndpoint(initialValues),
        queryKey: [buildEndpoint(initialValues)],
    });

    const handleReset = (
        resetForm: () => void,
        setFieldValue: (field: string, value: any) => void
    ) => {
        // Clear search params
        setSearchParams({});
        // Reset form values in Formik
        resetForm();
        // Explicitly reset the status field
        setFieldValue('status', '');
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
                        start_date: values.start_date,
                        end_date: values.end_date,
                        name: values.name,
                        status: values.status,
                    };
                    setSearchParams(params);
                }}
                onReset={handleReset}
                isLoading={isLoading}
                keywords={['coupon_code']}
                startDateName="start_date"
                endDateName="end_date"
                selectKeys={['status']}
            />

            <TableCompCustom
                showOnly={true}
                columns={columns}
                data={terms?.data || []}
                paginationData={terms?.meta || []}
                title={t('breadcrumb.coupons.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        {hasPermission('coupon.store') && (
                            <Link
                                to="/coupons/add"
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
