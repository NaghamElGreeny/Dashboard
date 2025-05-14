import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';
import ModalCustom from '../../components/template/modal/ModalCustom';
import { hasPermission } from '../../helper/permissionHelpers';
import type { FetchReportData, Report } from './types';

export default function Reports() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.reports.title') },
    ];

    const [page, setPage] = useState<number>(1);

    const [selectedReason, setSelectedReason] = useState<any>('');
    const [opened, setOpen] = useState<boolean>(false);

    const columns: MRT_ColumnDef<Report>[] = [
        {
            header: '#',
            Cell: ({ row }: { row: { index: number } }) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.service'),
            Cell: ({ row }: { row: { original: Report } }) => {
                const service =
                    row.original?.appointment_booking_data?.service_data?.service || '---';
                return <span>{service}</span>;
            },
            accessorKey: 'service',
        },
        {
            header: t('labels.reason'),
            Cell: ({ row }: { row: { original: Report } }) => {
                const reason = row.original?.report_reason_data?.reason || t('not_found');
                return (
                    <>
                        <FaEye
                            className="text-[19px] text-black ms-10 cursor-pointer"
                            onClick={() => {
                                setSelectedReason(reason ?? '');
                                // setSelectedReason(reason as string);
                                setOpen(true);
                            }}
                        />
                    </>
                );
            },

            accessorKey: 'reason',
        },

        {
            header: t('labels.client'),
            Cell: ({ row }: { row: { original: Report } }) => (
                <>
                    <div className="flex gap-2 items-center ms-1">
                        {hasPermission('show-Client')
                            ? [
                                  <Link
                                      to={`/clients/show/${row.original?.appointment_booking_data?.client_data?.id}`}
                                      className="text-blue-500 border-b border-blue-500 text-md"
                                  >
                                      {
                                          row?.original?.appointment_booking_data?.client_data
                                              ?.full_name
                                      }
                                  </Link>,
                              ]
                            : [
                                  <span>
                                      {
                                          row?.original?.appointment_booking_data?.client_data
                                              ?.full_name
                                      }
                                  </span>,
                              ]}
                    </div>
                </>
            ),

            accessorKey: 'client',
        },

        {
            header: t('labels.provider'),
            Cell: ({ row }: { row: { original: Report } }) => (
                <>
                    <div className="flex gap-2 items-center ms-1">
                        {hasPermission('show-Provider')
                            ? [
                                  <Link
                                      to={`/providers/show/${row.original?.appointment_booking_data?.provider_data?.id}`}
                                      className="text-blue-500 border-b border-blue-500 text-md"
                                  >
                                      {
                                          row?.original?.appointment_booking_data?.provider_data
                                              ?.full_name
                                      }
                                  </Link>,
                              ]
                            : [
                                  <span>
                                      {
                                          row?.original?.appointment_booking_data?.provider_data
                                              ?.full_name
                                      }
                                  </span>,
                              ]}
                    </div>
                </>
            ),

            accessorKey: 'provider',
        },

        {
            header: t('labels.reported_by'),
            Cell: ({ row }: { row: { original: Report } }) => {
                const reported_by = row.original?.reported_by || '---';
                return <span>{t(`labels.${reported_by}`)}</span>;
            },
            accessorKey: 'reported_by',
        },

        {
            header: t('labels.created_at'),
            Cell: ({ row }: { row: { original: Report } }) => {
                const created_at = row.original?.created_at || '---';
                return <span>{created_at}</span>;
            },
            accessorKey: 'created_at',
        },
    ];

    const queryParams = {
        page: page.toString(),
    };

    const searchParams = new URLSearchParams(queryParams);
    const endpoint = `report?${searchParams.toString()}`;

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchReportData>({
        endpoint: endpoint,
        queryKey: [endpoint],
    });

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <TableCompCustom
                showOnly={true}
                columns={columns}
                data={terms?.data || []}
                paginationData={terms?.meta || []}
                title={t('breadcrumb.reports.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
            />
            <ModalCustom opened={opened} setOpen={setOpen} title={t('labels.description')}>
                <div
                    dangerouslySetInnerHTML={{
                        __html: selectedReason,
                    }}
                ></div>
            </ModalCustom>
        </>
    );
}
