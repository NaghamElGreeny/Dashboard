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

export default function Packages() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.packages.title') },
    ];

    const [packageInfo, setPackageInfo] = useState<Object>('');
    const [page, setPage] = useState(1);

    const columns: MRT_ColumnDef[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.name'),
            Cell: ({ row }: any) => {
                const locale = i18n.language;
                const name = row.original[locale]?.name || t('not_found');
                return <span>{name}</span>;
            },
            accessorKey: 'name',
        },

        {
            accessorKey: 'type',
            header: t('labels.type'),
            Cell: ({ row }: any) => {
                return <span>{t(`labels.${row.original.type}`)}</span>;
            },
        },

        {
            accessorKey: 'price_for_one',
            header: t('labels.price_for_one'),
            Cell: ({ row }: any) => {
                return <span>{row.original.price_for_one}</span>;
            },
        },

        {
            header: t('labels.actions'),
            Cell: ({ renderedCellValue, row }: any) => (
                <div className="flex gap-2 items-center" style={{ marginInlineStart: '1rem' }}>
                    <Link to={`/packages/edit/${row.original?.id}`} className="flex gap-5 ">
                        <FaRegEdit className="text-[19px] text-warning ms-8" />
                    </Link>

                    <CrudIconDelete
                        deleteAction={() => {
                            setPackageInfo(row.original?.id);
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
    const endpoint = `packages?${searchParams.toString()}`;

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<any>({
        endpoint: endpoint,
        queryKey: [endpoint],
    });

    const { mutate: Delete } = useMutate({
        mutationKey: [`packages/${packageInfo}`],
        endpoint: `packages/${packageInfo}`,

        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', { name: t('breadcrumb.packages.title') }),
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
                title={t('breadcrumb.packages.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        <Link
                            to="/packages/add"
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
