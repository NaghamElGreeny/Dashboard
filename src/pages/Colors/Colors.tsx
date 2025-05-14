import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaRegEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import CrudIconDelete from '../../components/molecules/CrudIconDelete';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';
import { useMutate } from '../../hooks/UseMutate';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import type { FetchColorsData, Color } from './types';

export default function Colors() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.colors.title') },
    ];

    const [colorId, setColorId] = useState<Object>('');
    const [page, setPage] = useState(1);

    const columns: MRT_ColumnDef<Color>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.title'),
            Cell: ({ row }: { row: { original: Color } }) => {
                const title = row.original?.title || '---';
                return <span>{title}</span>;
            },
            accessorKey: 'title',
        },

        {
            header: t('labels.color'),
            Cell: ({ row }: { row: { original: Color } }) => {
                const hexColor = row.original?.hex;
                const isWhite = hexColor.toLowerCase() === '#fff'; // Check if the color is white

                return (
                    <div
                        style={{
                            backgroundColor: hexColor,
                            padding: '4px 8px',
                            borderRadius: '16px',
                            display: 'inline-block',
                            color: isWhite ? '#000' : '#fff',
                            border: isWhite ? '1px solid #000' : 'none',
                        }}
                    >
                        {hexColor}
                    </div>
                );
            },
            accessorKey: 'color',
        },

        {
            header: t('labels.actions'),
            Cell: ({ row }: any) => (
                <div className="flex gap-2 items-center" style={{ marginInlineStart: '1rem' }}>
                    <Link to={`/colors/edit/${row.original?.id}`} className="flex gap-5 ">
                        <FaRegEdit className="text-[19px] text-warning ms-8" />
                    </Link>

                    <CrudIconDelete
                        deleteAction={() => {
                            setColorId(row.original?.id);
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
    const endpoint = `color?${searchParams.toString()}`;

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchColorsData>({
        endpoint: endpoint,
        queryKey: [endpoint],
    });

    const { mutate: Delete } = useMutate({
        mutationKey: [`color/${colorId}`],
        endpoint: `color/${colorId}`,

        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', { name: t('breadcrumb.colors.title') }),
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
                title={t('breadcrumb.colors.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        <Link
                            to="/colors/add"
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
