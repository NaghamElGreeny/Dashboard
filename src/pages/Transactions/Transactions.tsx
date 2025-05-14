import { Button } from '@mantine/core';
import Cookies from 'js-cookie';
import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Loading from '../../components/atoms/loading';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import { hasPermission } from '../../helper/permissionHelpers';
import useFetch from '../../hooks/UseFetch';
import imageError from '/assets/images/logo.png';

export default function FinancialTransactions() {
    const baseURL = import.meta.env.VITE_BASE_URL;
    const user_token = Cookies.get('token');
    const token = user_token;

    const authorizationHeader = `Bearer ${token}`;

    const { t, i18n } = useTranslation();

    const [page, setPage] = useState<number>(1);

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.financial_transactions.title'), to: '/financial-transactions' },
    ];

    const handleExport = async () => {
        try {
            const response = await fetch(`${baseURL}/export-pdf`, {
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
                link.download = 'transactions.pdf';
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

    const queryParams = {
        page: page,
    };

    const searchParams = new URLSearchParams(queryParams as any);
    const endpoint = `transaction?${searchParams.toString()}`;

    const {
        data: terms,
        refetch,
        isLoading,
        isError,
    } = useFetch<any>({
        endpoint: endpoint,
        queryKey: [endpoint],
    });

    const columns: MRT_ColumnDef[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.transaction_code'),
            accessorKey: 'transaction_id',
            Cell: ({ row }: any) => {
                const transaction_id = row.original.transaction_id || '---';
                return <span className="text-success font-medium">#{transaction_id}</span>;
            },
            size: 40,
        },

        {
            header: t('labels.user'),
            Cell: ({ row }: any) => {
                const user_name = row.original?.user_data?.full_name || t('not_found');
                return (
                    <>
                        {hasPermission('show-Client')
                            ? [
                                  <Link
                                      to={`/clients/show/${row.original?.user_data?.id}`}
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
            accessorKey: 'user_data',
        },

        {
            accessorKey: 'amount',
            header: t('labels.amountMoney'),
            Cell: ({ row }: any) => {
                return <span>{row.original.amount || 0}</span>;
            },
        },

        {
            accessorKey: 'type',
            header: t('labels.type'),
            Cell: ({ row }: any) => {
                return <span>{row.original.type ? t(`labels.${row.original.type}`) : '---'}</span>;
            },
        },
    ];

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <Breadcrumb items={breadcrumbItems} />

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
                                <Button
                                    onClick={() => handleExport()}
                                    type="submit"
                                    className="bg-gradient-to-r from-primary to-secondary p-2 px-5 text-white font-semibold rounded-[0.25rem]"
                                    loading={isLoading}
                                >
                                   {t('buttons.export_pdf')}
                                </Button>
                            </>
                        }
                    />
                </>
            )}
        </>
    );
}
