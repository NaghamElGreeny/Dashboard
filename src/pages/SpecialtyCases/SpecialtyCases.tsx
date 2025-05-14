import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaRegEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import CrudIconDelete from '../../components/molecules/CrudIconDelete';
import ModalCustom from '../../components/template/modal/ModalCustom';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';
import { useMutate } from '../../hooks/UseMutate';
import type { SpecialtyCase, FetchSpecialtyCaseData } from './types';
import { hasPermission } from '../../helper/permissionHelpers';

export default function SpecialtyCases() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.specialtyCases.title') },
    ];

    const [specialtyCaseId, setSpecialtyCaseId] = useState<Object>('');
    const [page, setPage] = useState(1);
    const [opened, setOpen] = useState<boolean>(false);
    const [selectedTitle, setSelectedTitle] = useState<string>('');

    const columns: MRT_ColumnDef<SpecialtyCase>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.title'),
            Cell: ({ row }: { row: { original: SpecialtyCase } }) => {
                const title = row.original?.title || '---';
                const truncatedTitle = title.length > 20 ? title.substring(0, 20) + ' ' : title;

                return (
                    <>
                        <span>{truncatedTitle}</span>
                        {title.length > 20 && (
                            <span
                                className="text-primary font-bold cursor-pointer ms-2"
                                onClick={() => {
                                    setSelectedTitle(title);
                                    setOpen(true);
                                }}
                            >
                                ...
                            </span>
                        )}
                    </>
                );
            },
            accessorKey: 'title',
        },

        ...(hasPermission('speciality-case.update') || hasPermission('speciality-case.destroy')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ renderedCellValue, row }: any) => (
                          <div
                              className="flex gap-2 items-center"
                              style={{ marginInlineStart: '1rem' }}
                          >
                              {hasPermission('speciality-case.update') && (
                                  <Link
                                      to={`/specialty-cases/edit/${row.original?.id}`}
                                      className="flex gap-5"
                                  >
                                      <FaRegEdit className="text-[19px] text-warning ms-8" />
                                  </Link>
                              )}

                              {hasPermission('speciality-case.destroy') && (
                                  <CrudIconDelete
                                      deleteAction={() => {
                                          setSpecialtyCaseId(row.original?.id);
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
        mutationKey: [`speciality-case/${specialtyCaseId}`],
        endpoint: `speciality-case/${specialtyCaseId}`,

        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', { name: t('breadcrumb.specialtyCases.title') }),
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
    const endpoint = `speciality-case?${searchParams.toString()}`;

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchSpecialtyCaseData>({
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
                title={t('breadcrumb.specialtyCases.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        {hasPermission('speciality-case.index') && (
                            <Link
                                to="/specialty-cases/add"
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

            <ModalCustom opened={opened} setOpen={setOpen} title={t('labels.title')}>
                <div>{selectedTitle}</div>
            </ModalCustom>
        </>
    );
}
