import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';
import imageError from '/assets/images/logo.png';
import { hasPermission } from '../../helper/permissionHelpers';

export default function UsersChats() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.users_chats.title') },
    ];

    const [page, setPage] = useState(1);

    const columns: MRT_ColumnDef[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.sender'),
            Cell: ({ row }: any) => {
                const sender_name = row.original?.sender?.full_name || '---';
                return (
                    <>
                        {hasPermission('show-Client')
                            ? [
                                  <Link
                                      to={`/clients/show/${row.original?.sender?.id}`}
                                      className="flex items-center gap-2"
                                  >
                                      <img
                                          onError={(e: any) => (e.target.src = imageError)}
                                          src={row.original?.sender?.image || imageError}
                                          className="cursor-pointer w-[50px] h-[50px] rounded-full"
                                      />

                                      <span>{sender_name}</span>
                                  </Link>,
                              ]
                            : [
                                  <div className="flex items-center gap-2">
                                      <img
                                          onError={(e: any) => (e.target.src = imageError)}
                                          src={row.original?.sender?.image || imageError}
                                          className="cursor-pointer w-[50px] h-[50px] rounded-full"
                                      />

                                      <span>{sender_name}</span>
                                  </div>,
                              ]}
                    </>
                );
            },
            accessorKey: 'sender',
        },

        {
            header: t('labels.receiver'),
            Cell: ({ row }: any) => {
                const receiver_name = row.original?.receiver?.full_name || '---';
                return (
                    <>
                        {hasPermission('show-Client')
                            ? [
                                  <Link
                                      to={`/clients/show/${row.original?.receiver?.id}`}
                                      className="flex items-center gap-2"
                                  >
                                      <img
                                          onError={(e: any) => (e.target.src = imageError)}
                                          src={row.original?.receiver?.image || imageError}
                                          className="cursor-pointer w-[50px] h-[50px] rounded-full"
                                      />

                                      <span>{receiver_name}</span>
                                  </Link>,
                              ]
                            : [
                                  <div className="flex items-center gap-2">
                                      <img
                                          onError={(e: any) => (e.target.src = imageError)}
                                          src={row.original?.receiver?.image || imageError}
                                          className="cursor-pointer w-[50px] h-[50px] rounded-full"
                                      />

                                      <span>{receiver_name}</span>
                                  </div>,
                              ]}
                    </>
                );
            },
            accessorKey: 'user',
        },

        ...(hasPermission('showChat-Chat')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ row }: any) => (
                          <div className="flex gap-2 items-center ms-1">
                              <Link
                                  to={`/users-chats/show/${row.original?.chat_id}`}
                                  className="flex gap-5"
                              >
                                  <FaEye className="text-[19px] text-[#50cd89] ms-8" />
                              </Link>
                          </div>
                      ),
                      accessorKey: 'actions',
                  },
              ]
            : []),
    ];

    const queryParams = {
        page: page,
    };

    const searchParams = new URLSearchParams(queryParams as any);
    const endpoint = `chat?${searchParams.toString()}`;

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
                title={t('breadcrumb.users_chats.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
            />
        </>
    );
}
