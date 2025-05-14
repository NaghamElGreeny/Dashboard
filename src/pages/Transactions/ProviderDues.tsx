import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';
import { Link } from 'react-router-dom';
import imageError from '/assets/images/logo.png';

export default function ProviderDues() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.providers_dues.title') },
    ];

    const [page, setPage] = useState(1);

    const columns: MRT_ColumnDef[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.provider'),
            Cell: ({ row }: any) => {
                const locale = i18n.language;

                const provider_name = row.original?.provider?.name;
                return (
                    <Link
                        to={`/providers/show/${row.original?.provider?.id}`}
                        className="flex items-center gap-2"
                    >
                        <img
                            onError={(e: any) => (e.target.src = imageError)}
                            src={row.original?.provider?.logo}
                            className="w-[50px] h-[50px] rounded-full"
                        />
                        <span>{provider_name}</span>
                    </Link>
                );
            },
            accessorKey: 'provider',
        },

        // {
        //     header: t('labels.provider'),
        //     Cell: ({ row }: any) => {
        //         return <span>{row.original?.provider?.name || t('not_found')}</span>;
        //     },
        //     accessorKey: 'provider',
        // },

        {
            header: t('labels.total_provider_due'),
            Cell: ({ row }: any) => {
                return <span>{row.original.total_provider_due || t('not_found')}</span>;
            },
            accessorKey: 'total_provider_due',
        },
    ];

    const queryParams = {
        page: page,
    };

    const searchParams = new URLSearchParams(queryParams as any);
    const endpoint = `transactions/provider?${searchParams.toString()}`;

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
                title={t('breadcrumb.providers_dues.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
            />
        </>
    );
}
