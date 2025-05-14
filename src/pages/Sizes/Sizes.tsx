import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaRegEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import CrudIconDelete from '../../components/molecules/CrudIconDelete';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';
import { useMutate } from '../../hooks/UseMutate';
import type { FetchSizesData, Size } from './types';

export default function Sizes() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.sizes.title') },
    ];

    const [sizeId, setSizeId] = useState<Object>('');
    const [page, setPage] = useState(1);

    const columns: MRT_ColumnDef<Size>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.title'),
            Cell: ({ row }: { row: { original: Size } }) => {
                const locale = i18n.language;
                const title = row.original?.title || '----';
                return <span>{title}</span>;
            },
            accessorKey: 'title',
        },

        {
            header: t('labels.abbreviation'),
            Cell: ({ row }: { row: { original: Size } }) => {
                const locale = i18n.language;
                const tag = row.original?.tag || '----';
                return <span>{tag}</span>;
            },
            accessorKey: 'tag',
        },

        {
            header: t('labels.order'),
            Cell: ({ row }: { row: { original: Size } }) => {
                const ordering = row.original?.ordering || '----';
                return <span>{ordering}</span>;
            },
            accessorKey: 'ordering',
        },

        {
            header: t('labels.actions'),
            Cell: ({ row }: any) => (
                <div className="flex gap-2 items-center" style={{ marginInlineStart: '1rem' }}>
                    <Link to={`/sizes/edit/${row.original?.id}`} className="flex gap-5 ">
                        <FaRegEdit className="text-[19px] text-warning ms-8" />
                    </Link>

                    <CrudIconDelete
                        deleteAction={() => {
                            setSizeId(row.original?.id);
                            deleteItem();
                        }}
                    />
                </div>
            ),
            accessorKey: 'x',
        },
    ];

    const deleteItem = () => {
        showAlert(t('delete_confirmation'), '', false, t('ok'), true, 'warning', () => Delete({}));
    };

    const queryParams = {
        page: page,
    };

    const searchParams = new URLSearchParams(queryParams as any);
    const endpoint = `size?${searchParams.toString()}`;

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchSizesData>({
        endpoint: endpoint,
        queryKey: [endpoint],
    });

    const { mutate: Delete } = useMutate({
        mutationKey: [`size/${sizeId}`],
        endpoint: `size/${sizeId}`,

        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', { name: t('breadcrumb.sizes.title') }),
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
    return (
        <>
            <Breadcrumb items={breadcrumbItems} />

            <TableCompCustom
                showOnly={true}
                columns={columns}
                data={terms?.data || []}
                paginationData={terms?.meta || []}
                title={t('breadcrumb.sizes.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        <Link
                            to="/sizes/add"
                            className="bg-gradient-to-r from-primary to-secondary p-2 px-5 text-white font-semibold rounded-[0.25rem]"
                        >
                            <div className="flex items-center gap-2">
                                <FaPlus />
                                <span>{t('buttons.add')}</span>
                            </div>
                        </Link>
                    </>
                }
            />
        </>
    );
}
