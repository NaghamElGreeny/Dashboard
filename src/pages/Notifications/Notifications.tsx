import Cookies from 'js-cookie';
import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye, FaPlus, FaReplyAll } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import CrudIconDelete from '../../components/molecules/CrudIconDelete';
import ModalCustom from '../../components/template/modal/ModalCustom';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';
import { useMutate } from '../../hooks/UseMutate';
import type { FetchNotificationData, Notification } from './types';
import { hasPermission } from '../../helper/permissionHelpers';

export default function Notifications() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.notifications.title') },
    ];

    const baseURL = import.meta.env.VITE_BASE_URL;
    const user_token = Cookies.get('token');
    const token = user_token;

    const authorizationHeader = `Bearer ${token}`;

    const [notificationId, setNotificationId] = useState<Object>('');
    const [page, setPage] = useState<number>(1);

    const [opened, setOpen] = useState<boolean>(false);
    const [selectedBody, setSelectedBody] = useState<string>('');

    const columns: MRT_ColumnDef<Notification>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },
        {
            header: t('labels.title'),
            Cell: ({ row }: { row: { original: Notification } }) => {
                const title = row.original?.title || t('not_found');
                return <span>{title}</span>;
            },
            accessorKey: 'title',
        },
        {
            header: t('labels.description'),
            Cell: ({ row }: { row: { original: Notification } }) => {
                const body = row.original?.body || t('not_found');
                return (
                    <>
                        <FaEye
                            className="text-[19px] text-black ms-10 cursor-pointer"
                            onClick={() => {
                                setSelectedBody(body ?? '');
                                setOpen(true);
                            }}
                        />
                    </>
                );
            },
            accessorKey: 'body',
        },
        {
            accessorKey: 'is_read',
            header: t('labels.is_read'),
            Cell: ({ row }: { row: { original: Notification } }) => {
                return (
                    <>
                        {row.original.is_readed ? (
                            <span className="is_read statuses">{t('labels.read')}</span>
                        ) : (
                            <span className="un_read statuses">{t('labels.un_read')}</span>
                        )}
                    </>
                );
            },
        },
        {
            accessorKey: 'created_at',
            header: t('labels.created_at'),
            Cell: ({ row }: { row: { original: Notification } }) => {
                return <span>{row.original.created_at || t('not_found')}</span>;
            },
        },

        ...(hasPermission('notification.show') || hasPermission('notification.destroy')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ row }: any) => (
                          <div
                              className="flex gap-2 items-center"
                              style={{ marginInlineStart: '1rem' }}
                          >
                              {hasPermission('notification.show') && (
                                  <FaReplyAll
                                      onClick={() => {
                                          handleReadNotification(
                                              row.original?.id,
                                              row?.original?.notify_type
                                          );
                                      }}
                                      className="show-notification cursor-pointer text-[19px] text-[#50cd89] ms-8"
                                  />
                              )}

                              {hasPermission('notification.destroy') && (
                                  <CrudIconDelete
                                      deleteAction={() => {
                                          setNotificationId(row.original?.id);
                                          deleteItem();
                                      }}
                                  />
                              )}
                          </div>
                      ),
                      accessorKey: 'x',
                  },
              ]
            : []),
    ];

    const { mutate: Delete } = useMutate({
        mutationKey: [`notification/${notificationId}`],
        endpoint: `notification/${notificationId}`,
        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', { name: t('sidebar.admins') }),
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

    const deleteItem = () => {
        showAlert(t('delete_confirmation'), '', false, t('ok'), true, 'warning', () => Delete({}));
    };

    const queryParams = {
        page: page,
    };

    const searchParams = new URLSearchParams(queryParams as any);
    const endpoint = `notification?${searchParams.toString()}`;

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchNotificationData>({
        endpoint: endpoint,
        queryKey: [endpoint],
    });

    const handleReadNotification = async (id: number, type?: string) => {
        try {
            const res = await fetch(`${baseURL}/notification/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: authorizationHeader,
                    'Accept-Language': i18n.language,
                },
            });

            // Check if response is not OK (e.g., 404 Not Found)
            if (!res.ok) {
                const errorData = await res.json(); // Parse error response
                throw new Error(errorData?.message || t('errorOccurred')); // Throw custom error
            }

            refetch();
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title: t('notificationShowedSuccessfully'),
            });

            if (type === 'contact') {
                navigate('/contact-messages');
            } else {
                navigate('/notifications/index');
            }
        } catch (err: any) {
            // Show error message to the user
            ShowAlertMixin({
                type: 15,
                icon: 'error',
                title: err?.response?.data?.message || err?.message,
            });
        }
    };

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />

            <TableCompCustom
                showOnly={true}
                columns={columns}
                data={terms?.data || []}
                paginationData={terms?.meta || []}
                title={t('breadcrumb.notifications.send_notification')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        {hasPermission('notification.store') && (
                            <Link
                                to="/notifications/add"
                                className="bg-gradient-to-r from-primary to-secondary p-2 px-5 text-white font-semibold rounded-[0.25rem]"
                            >
                                <div className="flex items-center gap-2">
                                    <FaPlus />
                                    <span>{t('breadcrumb.notifications.send_notification')}</span>
                                </div>
                            </Link>
                        )}
                    </>
                }
            />

            <ModalCustom opened={opened} setOpen={setOpen} title={t('labels.description')}>
                <div>{selectedBody}</div>
            </ModalCustom>
        </>
    );
}
