import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import LightBox from '../../components/molecules/LightBox/LightBox';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';

export default function ContactMessages() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.complaints.title') },
    ];

    const [page, setPage] = useState(1);

    const columns: MRT_ColumnDef[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.image'),
            Cell: ({ renderedCellValue, row }: any) => (
                <div className="flex gap-5">
                    <LightBox
                        getItems={[
                            {
                                src: row.original.image,
                                // title: row.original.image,
                            },
                        ]}
                    />
                </div>
            ),
            accessorKey: 'image',
        },

        {
            header: t('labels.client_name'),
            Cell: ({ row }: any) => {
                const client_name = row.original?.client?.client_name || t('not_found');
                return <span>{client_name}</span>;
            },
            accessorKey: 'client_name',
        },

        {
            header: t('labels.provider'),
            Cell: ({ row }: any) => {
                const provider = row.original?.provider?.provider_name || t('not_found');
                return <span>{provider}</span>;
            },
            accessorKey: 'provider',
        },

        {
            header: t('labels.order_no'),
            accessorKey: 'order_no',
            Cell: ({ row }: any) => {
                // const order_no = row.original?.order?.id  || '---';
                const order_no = row.original?.order?.order_code || '---';
                return <span className="text-success font-medium">{order_no}</span>;
            },
            size: 40,
        },

        {
            accessorKey: 'created_at',
            header: t('labels.created_at'),
            Cell: ({ row }: any) => {
                return (
                    <>
                        <span>{row.original?.created_at}</span>
                    </>
                );
            },
        },
    ];

    const queryParams = {
        page: page,
    };

    const searchParams = new URLSearchParams(queryParams as any);
    const endpoint = `report?${searchParams.toString()}`;

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
                title={t('breadcrumb.complaints.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
            />
        </>
    );
}
