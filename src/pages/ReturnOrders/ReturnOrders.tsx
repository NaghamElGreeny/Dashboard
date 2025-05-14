import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import imageError from '/assets/images/logo.png';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';
import { FaEye } from 'react-icons/fa';
import ModalCustom from '../../components/template/modal/ModalCustom';

export default function ReturnOrders() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.ReturnOrders.title') },
    ];

    const [page, setPage] = useState(1);

    const [opened, setOpen] = useState<boolean>(false);
    const [selectedReturnCause, setSelectedReturnCause] = useState<string>('');

    const columns: MRT_ColumnDef[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.user'),
            Cell: ({ row }: any) => {
                const user_name = row.original?.user?.full_name || t('not_found');
                return (
                    <Link
                        to={`/users/show/${row.original?.user?.id}`}
                        className="flex items-center gap-2"
                    >
                        <img
                            onError={(e: any) => (e.target.src = imageError)}
                            src={row.original?.user?.image}
                            className="cursor-pointer w-[50px] h-[50px] rounded-full"
                        />

                        <span>{user_name}</span>
                    </Link>
                );
            },
            accessorKey: 'user',
        },

        {
            header: t('labels.provider'),
            Cell: ({ row }: any) => {
                const locale = i18n.language;

                const provider_name = row.original?.provider[locale]?.brand_name || t('not_found');
                return (
                    <div className="flex items-center gap-2">
                        <img
                            onError={(e: any) => (e.target.src = imageError)}
                            src={row.original?.provider?.brand_image}
                            className="w-[50px] h-[50px] rounded-full"
                        />

                        <span>{provider_name}</span>
                    </div>
                );
            },
            accessorKey: 'provider',
        },

        {
            header: t('labels.product'),
            Cell: ({ row }: any) => (
                <div className="flex gap-2 items-center ms-1">
                    <Link
                        to={`/products/show/${row.original?.product?.id}`}
                        className="text-blue-500 border-b border-blue-500 text-md"
                    >
                        {t('labels.show_product')}
                    </Link>
                </div>
            ),
            accessorKey: 'product',
        },

        {
            accessorKey: 'status',
            header: t('labels.status'),
            Cell: ({ row }: any) => {
                const status = t(`status.${row.original?.status}`) || t('not_found');
                return (
                    <>
                        <span className={`${row.original?.status} statuses `}>{status}</span>
                    </>
                );
            },
        },
        {
            header: t('labels.return_cause'),
            Cell: ({ row }: any) => {
                const return_cause = row.original.return_cause || t('not_found');
                return (
                    <>
                        <FaEye
                            className="text-[19px] text-black ms-10 cursor-pointer"
                            onClick={() => {
                                setSelectedReturnCause(return_cause);
                                setOpen(true);
                            }}
                        />
                    </>
                );
            },
            accessorKey: 'return_cause',
        },
    ];

    const queryParams = {
        page: page,
    };

    const searchParams = new URLSearchParams(queryParams as any);
    const endpoint = `return_orders?${searchParams.toString()}`;

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<any>({
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
                title={t('breadcrumb.ReturnOrders.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
            />

            <ModalCustom opened={opened} setOpen={setOpen} title={t('labels.return_cause')}>
                <div>{selectedReturnCause}</div>
            </ModalCustom>
        </>
    );
}
