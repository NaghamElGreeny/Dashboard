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
import { hasPermission } from '../../helper/permissionHelpers';
import { Link } from 'react-router-dom';
import imageError from '/assets/images/logo.png';
import { FetchRequestData, Request } from './types';

export default function WithdrawalRequests() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.withdrawal_requests.title') },
    ];

    const [page, setPage] = useState(1);
    const [withdrawalId, setWithdrawalId] = useState<Object>('');
    const [type, setType] = useState<Object>('');

    const columns: MRT_ColumnDef<Request>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.user'),
            Cell: ({ row }: { row: { original: Request } }) => {
                const user_name = row.original?.user_data?.name || '---';
                return (
                    <>
                        {hasPermission('show-Provider')
                            ? [
                                  <Link
                                      to={`/providers/show/${row.original?.user_data?.id}`}
                                      className="flex items-center gap-2"
                                  >
                                      <img
                                          onError={(e: any) => (e.target.src = imageError)}
                                          src={row.original?.user_data?.image || imageError}
                                          className="cursor-pointer w-[50px] h-[50px] rounded-full"
                                      />

                                      <span>{user_name}</span>
                                  </Link>,
                              ]
                            : [
                                  <div className="flex items-center gap-2">
                                      <img
                                          onError={(e: any) => (e.target.src = imageError)}
                                          src={row.original?.user_data?.image || imageError}
                                          className="cursor-pointer w-[50px] h-[50px] rounded-full"
                                      />

                                      <span>{user_name}</span>
                                  </div>,
                              ]}
                    </>
                );
            },
            accessorKey: 'user',
        },

        {
            header: t('labels.bank_name'),
            Cell: ({ row }: { row: { original: Request } }) => {
                const bank_name = row.original.bank_name || '---';
                return <span>{bank_name}</span>;
            },
            accessorKey: 'bank_name',
        },

        {
            header: t('labels.account_number'),
            Cell: ({ row }: { row: { original: Request } }) => {
                const account_number = row.original.account_number || '---';
                return <span>{account_number}</span>;
            },
            accessorKey: 'account_number',
        },

        {
            header: t('labels.iban'),
            Cell: ({ row }: { row: { original: Request } }) => {
                const iban = row.original.iban || '---';
                return <span>{iban}</span>;
            },
            accessorKey: 'iban',
        },

        {
            header: t('labels.amountMoney'),
            Cell: ({ row }: { row: { original: Request } }) => {
                const amount = row.original.amount || '---';
                return <span>{amount}</span>;
            },
            accessorKey: 'amount',
        },

        {
            accessorKey: 'status',
            header: t('labels.status'),
            Cell: ({ row }: { row: { original: Request } }) => {
                const status = t(`status.${row.original.status}`);
                return (
                    <>
                        <span className={`${row.original.status} statuses `}>
                            {row.original.status ? status : '---'}
                        </span>
                    </>
                );
            },
        },

        ...(hasPermission('withdrawal-request.accept') || hasPermission('withdrawal-request.reject')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ renderedCellValue, row }: any) => (
                          <>
                              {(row.original?.status === 'pending' && (
                                  <div
                                      className="flex gap-2 items-center"
                                      style={{ marginInlineStart: '1rem' }}
                                  >
                                      {hasPermission('withdrawal-request.accept') && (
                                          <MdOutlineCheckCircle
                                              onClick={() => {
                                                  const newStatus =
                                                      row.original?.is_active === true ? 0 : 1;
                                                  setWithdrawalId(row.original?.id);
                                                  setType('accept');
                                                  acceptConfirmation(newStatus);
                                              }}
                                              className="text-[22px] text-success ms-8 cursor-pointer"
                                          />
                                      )}

                                      {hasPermission('withdrawal-request.reject') && (
                                          <MdOutlineCancel
                                              onClick={() => {
                                                  const newStatus =
                                                      row.original?.is_active === true ? 0 : 1;
                                                  setWithdrawalId(row.original?.id);
                                                  setType('reject');
                                                  rejectConfirmation(newStatus);
                                              }}
                                              className="text-[22px] text-red-500 ms-8 cursor-pointer"
                                          />
                                      )}
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
              ]
            : []),
    ];

    const queryParams = {
        page: page,
    };

    const searchParams = new URLSearchParams(queryParams as any);
    const endpoint = `withdrawal-request?${searchParams.toString()}`;

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchRequestData>({
        endpoint: endpoint,
        queryKey: [endpoint],
    });

    const { mutate: acceptOrRejectMutate } = useMutate({
        mutationKey: [`withdrawal-request/${type}/${withdrawalId}`],
        endpoint: `withdrawal-request/${type}/${withdrawalId}`,
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
            acceptOrRejectMutate({ status: newStatus, _method: 'PATCH' })
        );
    };

    const rejectConfirmation = (newStatus: any) => {
        showAlert(t('reject_confirmation'), '', false, t('ok'), true, 'warning', () =>
            acceptOrRejectMutate({ status: newStatus, _method: 'PATCH' })
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
                title={t('breadcrumb.withdrawal_requests.title')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
            />
        </>
    );
}
