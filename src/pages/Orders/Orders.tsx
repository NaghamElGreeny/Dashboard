import { Button } from '@mantine/core';
import Cookies from 'js-cookie';
import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye } from 'react-icons/fa';
import { MdOutlineCancel, MdOutlineCheckCircle } from 'react-icons/md';
import { Link, useSearchParams } from 'react-router-dom';
import FilterSection from '../../components/atoms/filters/Filters';
import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import { hasPermission } from '../../helper/permissionHelpers';
import useFetch from '../../hooks/UseFetch';
import { FetchData, Order } from './types';

export default function Orders() {
    const baseURL = import.meta.env.VITE_BASE_URL;
    const user_token = Cookies.get('token');
    const token = user_token;

    const authorizationHeader = `Bearer ${token}`;

    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.orders.title') },
    ];

    const statusList = [
        { id: 0, value: 'accepted', label: t('status.accepted') },
        { id: 1, value: 'pending', label: t('status.pending') },
        { id: 2, value: 'in_the_way', label: t('status.in_the_way') },
        { id: 3, value: 'delivered', label: t('status.delivered') },
        { id: 4, value: 'cancelled', label: t('status.cancelled') },
        { id: 4, value: 'rejected', label: t('status.admin_rejected') },
    ];

    const [page, setPage] = useState<number>(1);
    const [searchParams, setSearchParams] = useSearchParams();

    const columns: MRT_ColumnDef<Order>[] = [
        {
            header: '#',
            Cell: ({ row }: { row: { index: number } }) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.order_no'),
            accessorKey: 'order_no',
            Cell: ({ row }: { row: { original: Order } }) => {
                const order_no = row.original?.order_no || '---';
                return <span className="text-success font-medium">#{order_no}</span>;
            },
            size: 40,
        },

        {
            header: t('labels.coupon_value'),
            Cell: ({ row }: { row: { original: Order } }) => {
                const coupon_value = row.original.coupon_value;
                return <span>{coupon_value}</span>;
            },
            accessorKey: 'coupon_value',
        },

        {
            header: t('labels.discount_value'),
            Cell: ({ row }: { row: { original: Order } }) => {
                const discount_value = row.original.discount_value || '---';
                return <span>{discount_value}</span>;
            },
            accessorKey: 'discount_value',
        },

        {
            header: t('labels.payment_type'),
            Cell: ({ row }: { row: { original: Order } }) => {
                const payment_type = row.original.payment_type;
                return <span>{payment_type ? t(`labels.${payment_type}`) : '---'}</span>;
            },
            accessorKey: 'payment_type',
        },

        {
            header: t('labels.shipping_value'),
            Cell: ({ row }: { row: { original: Order } }) => {
                const shipping_value = row.original.shipping_value;
                return <span>{shipping_value}</span>;
            },
            accessorKey: 'shipping_value',
        },

        {
            header: t('labels.sub_total'),
            Cell: ({ row }: { row: { original: Order } }) => {
                const sub_total = row.original.sub_total || '---';
                return <span>{sub_total}</span>;
            },
            accessorKey: 'sub_total',
        },

        {
            header: t('labels.vat_value'),
            Cell: ({ row }: { row: { original: Order } }) => {
                const vat_value = row.original?.vat_value;
                return <span>{vat_value}</span>;
            },
            accessorKey: 'vat_value',
        },

        {
            header: t('labels.total'),
            Cell: ({ row }: { row: { original: Order } }) => {
                const total = row.original?.total;
                return <span>{total}</span>;
            },
            accessorKey: 'total',
        },

        {
            header: t('labels.created_at'),
            Cell: ({ row }: { row: { original: Order } }) => {
                const created_at = row.original.created_at;
                return <span>{created_at || '---'}</span>;
            },
            accessorKey: 'created_at',
        },

        {
            accessorKey: 'status',
            header: t('labels.status'),
            Cell: ({ row }: { row: { original: Order } }) => {
                const status = row.original?.status;
                return (
                    <>
                        <span className={`${row.original?.status} statuses font-medium p-2`}>
                            {status ? t(`status.${status}`) : '---'}
                        </span>
                        {row.original?.status === 'pending' ? (
                            <div className="flex flex-wrap justify-start items-center mt-3 gap-2">
                                <div
                                    className="flex cursor-pointer gap-1"
                                    onClick={() => {
                                        completeConfirmation('accept', row.original?.id);
                                    }}
                                >
                                    <MdOutlineCheckCircle className="text-[22px] text-[#1da3a3]" />
                                    <span className="font-medium text-[#1da3a3]">
                                        {t('buttons.accept')}
                                    </span>
                                </div>

                                <div
                                    className="flex cursor-pointer gap-1"
                                    onClick={() => {
                                        cancelConfirmation('reject', row.original?.id);
                                    }}
                                >
                                    <MdOutlineCancel className="text-[22px] text-red-500 " />
                                    <span className="font-medium text-red-500">
                                        {t('buttons.cancel')}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <>
                                {row.original?.status === 'accepted' ? (
                                    <div className="flex flex-wrap justify-start items-center mt-3 gap-2">
                                        <div
                                            className="flex cursor-pointer gap-1"
                                            onClick={() => {
                                                inTheWayConfirmation(
                                                    'in-the-way',
                                                    row.original?.id
                                                );
                                            }}
                                        >
                                            <MdOutlineCheckCircle className="text-[22px] text-[#1268bf]" />
                                            <span className="font-medium text-[#1268bf]">
                                                {t('buttons.in_the_way')}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {row.original?.status === 'in_the_way' && (
                                            <div className="flex flex-wrap justify-start items-center mt-3 gap-2">
                                                <div
                                                    className="flex cursor-pointer gap-1"
                                                    onClick={() => {
                                                        deliverConfirmation(
                                                            'delivered',
                                                            row.original?.id
                                                        );
                                                    }}
                                                >
                                                    <MdOutlineCheckCircle className="text-[22px] text-success" />
                                                    <span className="font-medium text-success">
                                                        {t('buttons.deliver')}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </>
                );
            },
        },

        ...(hasPermission('show-Order')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ row }: { row: { original: Order } }) => (
                          <div
                              className="flex gap-2 items-center"
                              style={{ marginInlineStart: '1rem' }}
                          >
                              <Link to={`/orders/show/${row.original?.id}`} className="flex gap-5">
                                  <FaEye className="text-[19px] text-secondary ms-8" />
                              </Link>
                          </div>
                      ),
                      accessorKey: 'actions',
                  },
              ]
            : []),
    ];

    const handleChangeStatus = async (status?: string, id?: string) => {
        try {
            const res = await fetch(`${baseURL}/orders/${id}/${status}`, {
                method: 'POST',
                headers: {
                    Authorization: authorizationHeader,
                    'Accept-Language': i18n.language,
                },
            });

            // Check if response is not OK (e.g., 404 Not Found)
            if (!res.ok) {
                const errorData = await res.json(); // Parse error response
                throw new Error(errorData?.message || t('errorOccurred')); // Throw custom error
            }

            refetch();
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title: t('status_changed_successfully'),
            });
        } catch (err: any) {
            // Show error message to the user
            ShowAlertMixin({
                type: 15,
                icon: 'error',
                title: err?.response?.data?.message || err?.message,
            });
        }
    };

    const completeConfirmation = (newStatus?: string, id?: string) => {
        showAlert(t('accept_confirmation'), '', false, t('ok'), true, 'warning', () =>
            handleChangeStatus(newStatus, id)
        );
    };

    const inTheWayConfirmation = (newStatus?: string, id?: string) => {
        showAlert(t('in_the_way_confirmation'), '', false, t('ok'), true, 'warning', () =>
            handleChangeStatus(newStatus, id)
        );
    };

    const deliverConfirmation = (newStatus?: string, id?: string) => {
        showAlert(t('deliver_confirmation'), '', false, t('ok'), true, 'warning', () =>
            handleChangeStatus(newStatus, id)
        );
    };

    const cancelConfirmation = (newStatus?: string, id?: string) => {
        showAlert(t('reject_confirmation'), '', false, t('ok'), true, 'warning', () =>
            handleChangeStatus(newStatus, id)
        );
    };

    const initialValues = {
        status: searchParams.get('status') || '',
    };

    const buildEndpoint = (params: { status: string }) => {
        const queryParams = new URLSearchParams({ ...params, page: page.toString() });

        return `orders?${queryParams.toString()}`;
    };

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchData>({
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

    const handleExport = async () => {
        try {
            const response = await fetch(`${baseURL}/orders/export`, {
                headers: {
                    Authorization: authorizationHeader,
                    'Accept-Language': i18n.language,
                },
            });
            if (!response.ok) {
                ShowAlertMixin({
                    type: 15,
                    icon: 'error',
                    title: 'Error occurred while processing the file download',
                });
            } else {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.download = 'orders.xlsx';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (err: any) {
            ShowAlertMixin({
                type: 15,
                icon: 'error',
                title: err?.response?.data?.message || 'Error occurred while exporting data',
            });
        }
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
                        status: values.status,
                    };
                    setSearchParams(params);
                }}
                onReset={handleReset}
                isLoading={isLoading}
                selectKeys={['status']}
            />

            <TableCompCustom
                showOnly={true}
                columns={columns}
                data={terms?.data || []}
                paginationData={terms?.meta || []}
                title={t('breadcrumb.orders.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        <Button
                            onClick={() => handleExport()}
                            type="submit"
                            className="bg-gradient-to-r from-primary to-secondary p-2 px-5 text-white font-semibold rounded-[0.25rem]"
                            loading={isLoading}
                        >
                            {t('buttons.export_csv')}
                        </Button>
                    </>
                }
            />
        </>
    );
}
