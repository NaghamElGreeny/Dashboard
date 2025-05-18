import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye, FaPlus, FaRegEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import CrudIconDelete from '../../components/molecules/CrudIconDelete';
import LightBox from '../../components/molecules/LightBox/LightBox';
import ModalCustom from '../../components/template/modal/ModalCustom';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';
import { useMutate } from '../../hooks/UseMutate';

import type { Social, FetchSocialsData } from './types';

export default function Socials() {
    const { t, i18n } = useTranslation();
    const locale = localStorage.getItem('i18nextLng');
    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.socials.title') },
    ];

    const [socialId, setSocialId] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [opened, setOpen] = useState<boolean>(false);

    const columns: MRT_ColumnDef<Social>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },
        // {
        //     header: t('labels.icon'),
        //     Cell: ({ row }: any) => (
        //         <div className="flex gap-5">
        //             <LightBox
        //                 getItems={[
        //                     {
        //                         src: row.original.icon,
        //                     },
        //                 ]}
        //             />
        //         </div>
        //     ),
        //     accessorKey: 'icon',
        // },
        {
            header: t('labels.name'),
            Cell: ({ row }: any) => {
                const locale = i18n.language;
                const name = row.original?.key || t('not_found');
                return <span>{name}</span>;
            },
            accessorKey: 'name',
        },

        // {
        //     accessorKey: 'ordering',
        //     header: t('labels.order'),
        //     Cell: ({ row }: any) => {
        //         const ordering = row.original.ordering || t('not_found');
        //         return <span>{ordering}</span>;
        //     },
        // },

        {
            accessorKey: 'link',
            header: t('labels.link'),
            Cell: ({ row }: any) => {
                const link = row.original.value || t('not_found');
                return <span>{link}</span>;
            },
        },

        {
            header: t('labels.actions'),
            Cell: ({ row }: any) => (
                <div className="flex gap-2 items-center" style={{ marginInlineStart: '1rem' }}>
                    <Link to={`/contact-info/edit/${row.original?.id}`} className="flex gap-5">
                        <FaRegEdit
                            onClick={() => setOpen(true)}
                            className="text-[19px] text-warning ms-8"
                        />
                    </Link>
                    <CrudIconDelete
                        deleteAction={() => {
                            setSocialId(row.original?.id);
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
    const endpoint = `contact-info?${searchParams.toString()}`;

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchSocialsData>({
        endpoint: endpoint,
        queryKey: [endpoint],
    });

    const { mutate: Delete } = useMutate({
        mutationKey: [`contact-info/${socialId}`],
        endpoint: `contact-info/${socialId}`,
        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', { name: t('breadcrumb.socials.title') }),
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
                title={t('breadcrumb.socials.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        <Link
                            to="/contact-info/add"
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
