import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaRegEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import defaultAvatar from '/assets/images/avatar.jpg';
import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import CrudIconDelete from '../../components/molecules/CrudIconDelete';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';
import { useMutate } from '../../hooks/UseMutate';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import LightBox from '../../components/molecules/LightBox/LightBox';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Switch, useMantineTheme, rem } from '@mantine/core';
import Switcher from '../../components/molecules/Switcher';

export default function Banners() {
    const { t, i18n } = useTranslation();
    const theme = useMantineTheme();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.banners.title') },
    ];

    const [bannerId, setBannerId] = useState<Object>('');
    const [page, setPage] = useState(1);
    const [statusActive, setStatusActive] = useState<number>();

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
                    {/* <img
                        onError={(e) => (e.target.src = defaultAvatar)}
                        src={row.original.image}
                        className="cursor-pointer w-[50px] h-[50px] rounded-full"
                    /> */}
                </div>
            ),
            accessorKey: 'image',
        },

        {
            header: t('labels.title'),
            Cell: ({ row }: any) => {
                const locale = i18n.language; // Get current language
                const title = row.original[locale]?.title || t('not_found'); // Fallback if no title is found
                return <span>{title}</span>;
            },
            accessorKey: 'title',
        },

        {
            accessorKey: 'type',
            header: t('labels.banner_type'),
            Cell: ({ row }: any) => {
                return <span>{t(`labels.${row.original.type}`) || t('not_found')}</span>;
            },
        },

        {
            accessorKey: 'is_visible',
            header: t('labels.is_visible'),
            Cell: ({ row }: any) => {
                return (
                    <Switcher
                        label={
                            row.original?.is_visible ? t('labels.visible') : t('labels.invisible')
                        }
                        checked={row.original?.is_visible}
                        onChange={() => {
                            const newStatus = row.original?.is_visible === true ? 0 : 1;
                            setBannerId(row.original?.id);
                            setStatusActive(newStatus);
                            changeActive(newStatus);
                        }}
                    />
                );
            },
        },

        {
            header: t('labels.actions'),
            Cell: ({ renderedCellValue, row }: any) => (
                <div className="flex gap-2 items-center" style={{ marginInlineStart: '1rem' }}>
                    <Link to={`/banners/edit/${row.original?.id}`} className="flex gap-5 ">
                        <FaRegEdit className="text-[19px] text-warning ms-8" />
                    </Link>

                    <CrudIconDelete
                        deleteAction={() => {
                            setBannerId(row.original?.id);
                            deleteItem();
                        }}
                    />
                </div>
            ),
            accessorKey: 'x',
        },
    ];

    const { mutate: ChangeActiveMutate } = useMutate({
        mutationKey: [`banners/${bannerId}/toggle_visible`],
        endpoint: `banners/${bannerId}/toggle_visible`,
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

    const changeActive = (newStatus: any) => {
        showAlert(
            t('toggle_status_confirmation'),
            '',
            false,
            t('ok'),
            true,
            'warning',
            // () => ChangeActiveMutate({ is_visible: newStatus, _method: 'put' })
            () => ChangeActiveMutate({ is_visible: newStatus })
        );
    };
    const deleteItem = () => {
        showAlert(t('delete_confirmation'), '', false, t('ok'), true, 'warning', () => Delete({}));
    };

    const queryParams = {
        page: page,
    };

    const searchParams = new URLSearchParams(queryParams as any);
    const endpoint = `banners?${searchParams.toString()}`;

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<any>({
        endpoint: endpoint,
        queryKey: [endpoint],
    });

    const { mutate: Delete } = useMutate({
        mutationKey: [`banners/${bannerId}`],
        endpoint: `banners/${bannerId}`,

        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', { name: t('breadcrumb.banners.title') }),
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
                title={t('breadcrumb.banners.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        <Link
                            to="/banners/add"
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
