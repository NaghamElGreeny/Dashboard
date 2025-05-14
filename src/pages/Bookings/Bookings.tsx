import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye } from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';
import { Link, useSearchParams } from 'react-router-dom';
import FilterSection from '../../components/atoms/filters/Filters';
import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import { hasPermission } from '../../helper/permissionHelpers';
import useFetch from '../../hooks/UseFetch';
import { useMutate } from '../../hooks/UseMutate';
import type { Booking, FetchBookingData } from './types';

export default function Bookings() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.bookings.title') },
    ];

    const [page, setPage] = useState<number>(1);
    const [bookingId, setBookingId] = useState<Object>('');
    const [searchParams, setSearchParams] = useSearchParams();

    const columns: MRT_ColumnDef<Booking>[] = [
        {
            header: '#',
            Cell: ({ row }: { row: { index: number } }) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.service'),
            Cell: ({ row }: { row: { original: Booking } }) => {
                const service = row.original?.service_data?.service || '---';
                return <span>{service}</span>;
            },
            accessorKey: 'service',
        },

        {
            header: t('labels.total_price'),
            Cell: ({ row }: { row: { original: Booking } }) => {
                const total_price = row.original?.total_price || '---';
                return <span>{total_price}</span>;
            },
            accessorKey: 'total_price',
        },

        {
            header: t('labels.booking_date'),
            Cell: ({ row }: { row: { original: Booking } }) => {
                const date = row.original?.date;
                return <span>{date || '---'}</span>;
            },
            accessorKey: 'booking_date',
        },

        {
            header: t('labels.booking_time'),
            Cell: ({ row }: { row: { original: Booking } }) => {
                const time = row.original?.time;
                return <span>{time || '---'}</span>;
            },
            accessorKey: 'booking_time',
        },

        {
            accessorKey: 'is_rescheduled',
            header: t('labels.is_rescheduled'),
            Cell: ({ row }: { row: { original: Booking } }) => {
                const is_rescheduled = row.original?.is_rescheduled ? t('yes') : t('no');
                return (
                    <>
                        <span
                            className={`${
                                row.original?.is_rescheduled ? 'active' : 'inactive'
                            } statuses `}
                        >
                            {is_rescheduled}
                        </span>
                    </>
                );
            },
        },

        {
            accessorKey: 'status',
            header: t('labels.status'),
            Cell: ({ row }: { row: { original: Booking } }) => {
                const status_translated = row.original?.status_translated;
                return (
                    <>
                        <span className={`${row.original?.status} statuses `}>
                            {row.original?.status ? status_translated : '---'}
                        </span>

                        {row.original?.status === 'active' &&
                            (hasPermission('booking.cancelBooking') ? (
                                <div
                                    className="flex gap-2 items-center mt-3"
                                    style={{ marginInlineStart: '1rem' }}
                                >
                                    <MdOutlineCancel
                                        onClick={() => {
                                            setBookingId(row.original?.id);
                                            cancelConfirmation();
                                        }}
                                        className="text-[22px] text-red-500 ms-8 cursor-pointer"
                                    />
                                </div>
                            ) : (
                                ''
                            ))}
                    </>
                );
            },
        },

        {
            header: t('labels.created_at'),
            Cell: ({ row }: { row: { original: Booking } }) => {
                const created_at = row.original?.created_at || '---';
                return <span>{created_at || '---'}</span>;
            },
            accessorKey: 'created_at',
        },

        ...(hasPermission('booking.show')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ row }: any) => (
                          <div className="flex gap-2 items-center ms-1">
                              <Link to={`/bookings/show/${row.original.id}`} className="flex gap-5">
                                  <FaEye className="text-[19px] text-[#50cd89] ms-8" />
                              </Link>
                          </div>
                      ),
                      accessorKey: 'actions',
                  },
              ]
            : []),
    ];

    const { mutate: cancelMutate } = useMutate({
        mutationKey: [`booking/cancellation/${bookingId}`],
        endpoint: `booking/cancellation/${bookingId}`,
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

    const cancelConfirmation = () => {
        showAlert(t('cancel_confirmation'), '', false, t('ok'), true, 'warning', () =>
            cancelMutate({})
        );
    };

    const initialValues = {
        date: searchParams.get('date') || '',
        service_id: searchParams.get('service_id') || '',
    };

    const buildEndpoint = (params: { date: string; service_id: string }) => {
        const queryParams = new URLSearchParams({ ...params, page: page.toString() });

        return `booking?${queryParams.toString()}`;
    };

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchBookingData>({
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

        // Explicitly reset the service_id field
        setFieldValue('service_id', '');
    };

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />

            {/* filter section */}
            <FilterSection
                isGeneralApi={true}
                apiName="service/list-without-pag"
                initialValues={initialValues}
                onSubmit={(values) => {
                    const params = {
                        date: values.date,
                        service_id: values.service_id,
                    };
                    setSearchParams(params);
                }}
                onReset={handleReset}
                isLoading={isLoading}
                selectKeys={['service_id']}
                startDateName="date"
                dateLabel="booking_date"
            />

            <TableCompCustom
                showOnly={true}
                columns={columns}
                data={terms?.data || []}
                paginationData={terms?.meta || []}
                title={t('breadcrumb.bookings.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
            />
        </>
    );
}
