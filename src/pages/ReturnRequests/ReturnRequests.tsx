import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineCancel, MdOutlineCheckCircle } from 'react-icons/md';
import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';
import { useMutate } from '../../hooks/UseMutate';
import type { FetchReturnRequestsData, ReturnRequest } from './types';
import { FaEye } from 'react-icons/fa';
import ModalCustom from '../../components/template/modal/ModalCustom';

export default function ReturnRequests() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.return_requests.title') },
    ];

    const [page, setPage] = useState(1);
    const [requestId, setRequestId] = useState<Object>('');
    const [type, setType] = useState<Object>('');

    const [opened, setOpen] = useState<boolean>(false);
    const [selectedReason, setSelectedReason] = useState<string>('');

    const columns: MRT_ColumnDef<ReturnRequest>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.return_amount'),
            Cell: ({ row }: { row: { original: ReturnRequest } }) => {
                const return_amount = row.original.return_amount || 0;
                return <span>{return_amount}</span>;
            },
            accessorKey: 'return_amount',
        },

        {
            header: t('labels.reason'),
            Cell: ({ row }: { row: { original: ReturnRequest } }) => {
                const reason = row.original?.reason || t('not_found');
                return (
                    <>
                        <FaEye
                            className="text-[19px] text-black ms-10 cursor-pointer"
                            onClick={() => {
                                setSelectedReason(reason ?? '');
                                setOpen(true);
                            }}
                        />
                    </>
                );
            },

            accessorKey: 'reason',
        },

        {
            accessorKey: 'status',
            header: t('labels.status'),
            Cell: ({ row }: any) => {
                const status = t(`status.${row.original.status}`) || t('not_found');
                return (
                    <>
                        <span className={`${row.original.status} statuses `}>{status}</span>
                    </>
                );
            },
        },

        {
            header: t('labels.actions'),
            Cell: ({ renderedCellValue, row }: any) => (
                <>
                    {(row.original?.status === 'hold' && (
                        <div
                            className="flex gap-2 items-center"
                            style={{ marginInlineStart: '1rem' }}
                        >
                            <MdOutlineCheckCircle
                                onClick={() => {
                                    setRequestId(row.original?.id);
                                    setType('accept');
                                    acceptConfirmation();
                                }}
                                className="text-[22px] text-success ms-8 cursor-pointer"
                            />

                            <MdOutlineCancel
                                onClick={() => {
                                    setRequestId(row.original?.id);
                                    setType('reject');
                                    rejectConfirmation();
                                }}
                                className="text-[22px] text-red-500 ms-8 cursor-pointer"
                            />
                        </div>
                    )) || (
                        <div
                            className="flex gap-2 items-center"
                            style={{ marginInlineStart: '1rem' }}
                        >
                            ---
                        </div>
                    )}
                </>
            ),
            accessorKey: 'x',
        },
    ];

    const queryParams = {
        page: page,
    };

    const searchParams = new URLSearchParams(queryParams as any);
    const endpoint = `return_requests?${searchParams.toString()}`;

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchReturnRequestsData>({
        endpoint: endpoint,
        queryKey: [endpoint],
    });

    const { mutate: acceptOrRejectMutate } = useMutate({
        mutationKey: [`return_requests/${requestId}/${type}`],
        endpoint: `return_requests/${requestId}/${type}`,
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

    const acceptConfirmation = () => {
        showAlert(t('accept_confirmation'), '', false, t('ok'), true, 'warning', () =>
            acceptOrRejectMutate({})
        );
    };

    const rejectConfirmation = () => {
        showAlert(t('reject_confirmation'), '', false, t('ok'), true, 'warning', () =>
            acceptOrRejectMutate({})
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
                title={t('breadcrumb.return_requests.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
            />

            <ModalCustom opened={opened} setOpen={setOpen} title={t('labels.reason')}>
                <div
                    dangerouslySetInnerHTML={{
                        __html: selectedReason || t('not_found'),
                    }}
                ></div>
            </ModalCustom>
        </>
    );
}
