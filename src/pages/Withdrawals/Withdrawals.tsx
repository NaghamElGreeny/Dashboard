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

export default function Withdrawals() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.withdrawals.title') },
    ];

    const [page, setPage] = useState(1);
    const [withdrawalId, setWithdrawalId] = useState<Object>('');
    const [type, setType] = useState<Object>('');
    const [acceptItem, setAcceptItem] = useState<number>();
    const [rejectItem, setRejectItem] = useState<number>();

    const columns: MRT_ColumnDef[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.user_name'),
            Cell: ({ row }: any) => {
                const user_name = row.original.user_name || t('not_found');
                return <span>{user_name}</span>;
            },
            accessorKey: 'user_name',
        },

        {
            header: t('labels.bank_name'),
            Cell: ({ row }: any) => {
                const bank_name = row.original.bank_name || t('not_found');
                return <span>{bank_name}</span>;
            },
            accessorKey: 'bank_name',
        },

        {
            header: t('labels.currency'),
            Cell: ({ row }: any) => {
                const currency = row.original.currency || t('not_found');
                return <span>{currency}</span>;
            },
            accessorKey: 'currency',
        },

        {
            accessorKey: 'user_type',
            header: t('labels.user_type'),
            Cell: ({ row }: any) => {
                const user_type = t(`labels.${row.original.user_type}`) || t('not_found');
                return (
                    <>
                        <span>{user_type}</span>
                    </>
                );
            },
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
                    {(row.original?.status === 'pending' && (
                        <div
                            className="flex gap-2 items-center"
                            style={{ marginInlineStart: '1rem' }}
                        >
                            <MdOutlineCheckCircle
                                onClick={() => {
                                    const newStatus = row.original?.is_active === true ? 0 : 1;
                                    setWithdrawalId(row.original?.id);
                                    setType('accept');
                                    setAcceptItem(newStatus);
                                    acceptConfirmation(newStatus);
                                }}
                                className="text-[22px] text-success ms-8 cursor-pointer"
                            />

                            <MdOutlineCancel
                                onClick={() => {
                                    const newStatus = row.original?.is_active === true ? 0 : 1;
                                    setWithdrawalId(row.original?.id);
                                    setType('reject');
                                    setRejectItem(newStatus);
                                    rejectConfirmation(newStatus);
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
    const endpoint = `withdrawals?${searchParams.toString()}`;

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<any>({
        endpoint: endpoint,
        queryKey: [endpoint],
    });

    const { mutate: acceptOrRejectMutate } = useMutate({
        mutationKey: [`withdrawals/${withdrawalId}/${type}`],
        endpoint: `withdrawals/${withdrawalId}/${type}`,
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

    const acceptConfirmation = (newStatus: any) => {
        showAlert(t('accept_confirmation'), '', false, t('ok'), true, 'warning', () =>
            acceptOrRejectMutate({ status: newStatus })
        );
    };

    const rejectConfirmation = (newStatus: any) => {
        showAlert(t('reject_confirmation'), '', false, t('ok'), true, 'warning', () =>
            acceptOrRejectMutate({ status: newStatus })
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
                title={t('breadcrumb.withdrawals.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
            />
        </>
    );
}
