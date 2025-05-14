import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye, FaPlus, FaRegEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import CrudIconDelete from '../../components/molecules/CrudIconDelete';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';
import { useMutate } from '../../hooks/UseMutate';
import type { Role, FetchRoleData } from './types';
import { hasPermission } from '../../helper/permissionHelpers';
import ModalCustom from '../../components/template/modal/ModalCustom';

export default function RolePage() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.roles.title') },
    ];

    const [roleId, setRoleId] = useState<Object>('');
    const [page, setPage] = useState(1);

    const [opened, setOpen] = useState<boolean>(false);
    const [selectedPermissions, setSelectedPermissions] = useState<string>('');

    const columns: MRT_ColumnDef<Role>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.title'),
            Cell: ({ row }: { row: { original: Role } }) => {
                const name = row.original?.name || '---';
                return <span>{name}</span>;
            },
            accessorKey: 'name',
        },

        {
            header: t('labels.permissions'),
            Cell: ({ row }: { row: { original: Role } }) => {
                const permissions = row.original?.permission || [];
                const permissionTitles = permissions.map((per: any) => per.title).join(', '); // Extracting titles

                return (
                    <>
                        <FaEye
                            className="text-[19px] text-primary ms-10 cursor-pointer"
                            onClick={() => {
                                setSelectedPermissions(permissionTitles || t('not_found')); // Setting titles in state
                                setOpen(true);
                            }}
                        />
                    </>
                );
            },
            accessorKey: 'permissions',
        },

        ...(hasPermission('role.update') || hasPermission('role.destroy')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ renderedCellValue, row }: any) => (
                          <div
                              className="flex gap-2 items-center"
                              style={{ marginInlineStart: '1rem' }}
                          >
                              {hasPermission('role.update') && (
                                  <Link
                                      to={`/roles/edit/${row.original?.id}`}
                                      className="flex gap-5 "
                                  >
                                      <FaRegEdit className="text-[19px] text-warning ms-8" />
                                  </Link>
                              )}
                              {hasPermission('role.destroy') && (
                                  <CrudIconDelete
                                      deleteAction={() => {
                                          setRoleId(row.original?.id);
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
    const deleteItem = () => {
        showAlert(t('delete_confirmation'), '', false, t('ok'), true, 'warning', () => Delete({}));
    };
    const queryParams = {
        page: page,
    };

    const searchParams = new URLSearchParams(queryParams as any);
    const endpoint = `role?${searchParams.toString()}`;

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchRoleData>({
        endpoint: endpoint,
        queryKey: [endpoint],
    });

    const { mutate: Delete } = useMutate({
        mutationKey: [`role/${roleId}`],
        endpoint: `role/${roleId}`,
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', { name: t('breadcrumb.roles.title') }),
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
                title={t('breadcrumb.roles.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        {hasPermission('role.store') && (
                            <Link
                                to="/roles/add"
                                className="bg-gradient-to-r from-primary to-secondary p-2 px-5 text-white font-semibold rounded-[0.25rem]"
                            >
                                <div className="flex items-center gap-2">
                                    <FaPlus />
                                    <span>{t('buttons.add')}</span>
                                </div>
                            </Link>
                        )}
                    </>
                }
            />

            <ModalCustom opened={opened} setOpen={setOpen} title={t('labels.permissions')}>
                <div>
                    {selectedPermissions ? (
                        selectedPermissions.split(',').map((permission, index) => (
                            <div key={index} className="flex items-center gap-2 my-2">
                                <span className="text-lg font-semibold">{index + 1}.</span>
                                {/* Display index */}
                                <span>{permission.trim()}</span> {/* Display permission title */}
                            </div>
                        ))
                    ) : (
                        <span>{t('not_found')}</span>
                    )}
                </div>
            </ModalCustom>
        </>
    );
}
