import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye } from 'react-icons/fa';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import ModalCustom from '../../components/template/modal/ModalCustom';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';

export default function ContactMessages() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.contact_messages.title') },
    ];

    const [page, setPage] = useState(1);
    const [openMessage, setOpenMessage] = useState<boolean>(false);
    const [selectedMessage, setSelectedMessage] = useState<string>('');

    const columns: MRT_ColumnDef[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.full_name'),
            Cell: ({ row }: any) => {
                const full_name = row.original.full_name || t('not_found');
                return <span>{full_name}</span>;
            },
            accessorKey: 'full_name',
        },

        {
            header: t('labels.user'),
            Cell: ({ row }: any) => {
                const user_name = row.original.user_data?.name || t('not_found');
                return <span>{user_name}</span>;
            },
            accessorKey: 'user',
        },

        {
            accessorKey: 'title',
            header: t('labels.title'),
            Cell: ({ row }: any) => {
                return (
                    <>
                        <span>{row.original?.title || t('not_found')}</span>
                    </>
                );
            },
        },

        {
            header: t('labels.message'),
            Cell: ({ row }: any) => {
                const message = row.original.message || t('not_found');
                return (
                    <>
                        <FaEye
                            className="text-[19px] text-primary ms-10 cursor-pointer"
                            onClick={() => {
                                setSelectedMessage(message);
                                setOpenMessage(true);
                            }}
                        />
                    </>
                );
            },
            accessorKey: 'message',
        },
    ];

    const queryParams = {
        page: page,
    };

    const searchParams = new URLSearchParams(queryParams as any);
    const endpoint = `contact-us?${searchParams.toString()}`;

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
                title={t('breadcrumb.contact_messages.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
            />

            <ModalCustom opened={openMessage} setOpen={setOpenMessage} title={t('labels.message')}>
                <div>{selectedMessage}</div>
            </ModalCustom>
        </>
    );
}
