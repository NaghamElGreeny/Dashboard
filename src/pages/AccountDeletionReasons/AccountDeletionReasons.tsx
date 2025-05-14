import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaRegEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import CrudIconDelete from '../../components/molecules/CrudIconDelete';
import ModalCustom from '../../components/template/modal/ModalCustom';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';
import { useMutate } from '../../hooks/UseMutate';
import type { AccountDeletionReason, FetchAccountDeletionReasonData } from './types';
import { hasPermission } from '../../helper/permissionHelpers';

export default function AccountDeletionReasons() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.accountDeletionReasons.title') },
    ];

    const [accountDeletionReasonId, setAccountDeletionReasonId] = useState<Object>('');
    const [page, setPage] = useState(1);
    const [opened, setOpen] = useState<boolean>(false);
    const [selectedReason, setSelectedReason] = useState<string>('');

    const columns: MRT_ColumnDef<AccountDeletionReason>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.reason'),
            Cell: ({ row }: { row: { original: AccountDeletionReason } }) => {
                const reason = row.original?.reason || '---';
                const truncatedReason = reason.length > 20 ? reason.substring(0, 20) + ' ' : reason;

                return (
                    <>
                        <span>{truncatedReason}</span>
                        {reason.length > 20 && (
                            <span
                                className="text-primary font-bold cursor-pointer ms-2"
                                onClick={() => {
                                    setSelectedReason(reason);
                                    setOpen(true);
                                }}
                            >
                                ...
                            </span>
                        )}
                    </>
                );
            },
            accessorKey: 'reason',
        },

        ...(hasPermission('account-deletion-reason.update') ||
        hasPermission('account-deletion-reason.destroy')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ renderedCellValue, row }: any) => (
                          <div
                              className="flex gap-2 items-center"
                              style={{ marginInlineStart: '1rem' }}
                          >
                              {hasPermission('account-deletion-reason.update') && (
                                  <Link
                                      to={`/account-deletion-reasons/edit/${row.original?.id}`}
                                      className="flex gap-5"
                                  >
                                      <FaRegEdit className="text-[19px] text-warning ms-8" />
                                  </Link>
                              )}

                              {hasPermission('account-deletion-reason.destroy') && (
                                  <CrudIconDelete
                                      deleteAction={() => {
                                          setAccountDeletionReasonId(row.original?.id);
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

    const { mutate: Delete } = useMutate({
        mutationKey: [`account-deletion-reason/${accountDeletionReasonId}`],
        endpoint: `account-deletion-reason/${accountDeletionReasonId}`,

        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', {
                        name: t('breadcrumb.accountDeletionReasons.title'),
                    }),
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

    const queryParams = {
        page: page,
    };

    const searchParams = new URLSearchParams(queryParams as any);
    const endpoint = `account-deletion-reason?${searchParams.toString()}`;

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchAccountDeletionReasonData>({
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
                title={t('breadcrumb.accountDeletionReasons.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        {hasPermission('account-deletion-reason.store') && (
                            <Link
                                to="/account-deletion-reasons/add"
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

            <ModalCustom opened={opened} setOpen={setOpen} title={t('labels.reason')}>
                <div>{selectedReason}</div>
            </ModalCustom>
        </>
    );
}
