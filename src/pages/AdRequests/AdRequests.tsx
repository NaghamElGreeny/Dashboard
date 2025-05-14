import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import LightBox from '../../components/molecules/LightBox/LightBox';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';

export default function AdRequests() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.ad_requests.title') },
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
                                src: row.original.logo,
                                // title: row.original.logo,
                            },
                        ]}
                    />
                </div>
            ),
            accessorKey: 'image',
        },

        {
            header: t('labels.provider'),
            Cell: ({ row }: any) => {
                const provider = row.original?.store_name || t('not_found');
                return <span>{provider}</span>;
            },
            accessorKey: 'provider',
        },

        {
            header: t('labels.email'),
            Cell: ({ row }: any) => {
                const email = row.original?.email || t('not_found');
                return <span>{email}</span>;
            },
            accessorKey: 'email',
        },

        {
            header: t('labels.phone'),
            Cell: ({ row }: any) => {
                const phone = row.original?.phone || t('not_found');
                return <span>{phone}</span>;
            },
            accessorKey: 'phone',
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
    const endpoint = `request_ad?${searchParams.toString()}`;

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
                title={t('breadcrumb.ad_requests.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
            />
        </>
    );
}
