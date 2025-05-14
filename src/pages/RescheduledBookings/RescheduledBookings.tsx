import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import FilterSection from '../../components/atoms/filters/Filters';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import { hasPermission } from '../../helper/permissionHelpers';
import useFetch from '../../hooks/UseFetch';
import type { FetchRescheduledBookingData, RescheduledBooking } from './types';

export default function RescheduledBookings() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.rescheduled_bookings.title') },
    ];

    const [page, setPage] = useState<number>(1);
    const [searchParams, setSearchParams] = useSearchParams();

    const statusList = [
        { id: 0, value: 'pending', label: t('status.pending') },
        { id: 1, value: 'accepted', label: t('status.accepted') },
        { id: 2, value: 'rejected', label: t('status.rejected') },
    ];

    const columns: MRT_ColumnDef<RescheduledBooking>[] = [
        {
            header: '#',
            Cell: ({ row }: { row: { index: number } }) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.service'),
            Cell: ({ row }: { row: { original: RescheduledBooking } }) => {
                const service = row.original?.booking_data?.service_data?.service || '---';
                return <span>{service}</span>;
            },
            accessorKey: 'service',
        },

        {
            header: t('labels.client'),
            Cell: ({ row }: { row: { original: RescheduledBooking } }) => (
                <>
                    <div className="flex gap-2 items-center ms-1">
                        {hasPermission('show-Client')
                            ? [
                                  <Link
                                      to={`/clients/show/${row.original?.booking_data?.client_data?.id}`}
                                      className="text-blue-500 border-b border-blue-500 text-md"
                                  >
                                      {row?.original?.booking_data?.client_data?.full_name}
                                  </Link>,
                              ]
                            : [<span>{row?.original?.booking_data?.client_data?.full_name}</span>]}
                    </div>
                </>
            ),

            accessorKey: 'client',
        },

        {
            header: t('labels.provider'),
            Cell: ({ row }: { row: { original: RescheduledBooking } }) => (
                <>
                    <div className="flex gap-2 items-center ms-1">
                        {hasPermission('show-Provider')
                            ? [
                                  <Link
                                      to={`/providers/show/${row.original?.booking_data?.provider_data?.id}`}
                                      className="text-blue-500 border-b border-blue-500 text-md"
                                  >
                                      {row?.original?.booking_data?.provider_data?.full_name}
                                  </Link>,
                              ]
                            : [
                                  <span>
                                      {row?.original?.booking_data?.provider_data?.full_name}
                                  </span>,
                              ]}
                    </div>
                </>
            ),

            accessorKey: 'provider',
        },

        {
            header: t('labels.rescheduled_date'),
            Cell: ({ row }: { row: { original: RescheduledBooking } }) => {
                const rescheduled_date = row.original?.rescheduled_date;
                return <span>{rescheduled_date || '---'}</span>;
            },
            accessorKey: 'rescheduled_date',
        },

        {
            header: t('labels.rescheduled_time'),
            Cell: ({ row }: { row: { original: RescheduledBooking } }) => {
                const rescheduled_time = row.original?.rescheduled_time;
                return <span>{rescheduled_time || '---'}</span>;
            },
            accessorKey: 'rescheduled_time',
        },

        {
            accessorKey: 'status',
            header: t('labels.status'),
            Cell: ({ row }: { row: { original: RescheduledBooking } }) => {
                const status = row.original?.status;
                return (
                    <>
                        <span className={`${row.original?.status} statuses `}>
                            {status ? t(`status.${status}`) : '---'}
                        </span>
                    </>
                );
            },
        },
    ];

    const initialValues = {
        status: searchParams.get('status') || '',
    };

    const buildEndpoint = (params: { status: string }) => {
        const queryParams = new URLSearchParams({ ...params, page: page.toString() });

        return `rescheduled-booking?${queryParams.toString()}`;
    };

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchRescheduledBookingData>({
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
                title={t('breadcrumb.rescheduled_bookings.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
            />
        </>
    );
}
