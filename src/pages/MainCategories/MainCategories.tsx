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
import { hasPermission } from '../../helper/permissionHelpers';
import useFetch from '../../hooks/UseFetch';
import { useMutate } from '../../hooks/UseMutate';
import type { MainCategory, FetchMainCategoryData } from './types';
import imageError from '/assets/images/logo.png';
import LightBox from '../../components/molecules/LightBox/LightBox';

export default function MainCategories() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.main_categories.title') },
    ];

    const [page, setPage] = useState(1);
    const [categoryId, setMainCategoryId] = useState<Object>('');

    const columns: MRT_ColumnDef<MainCategory>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.image'),
            Cell: ({ row }: { row: { original: MainCategory } }) => (
                <div className="flex gap-5">
                    <LightBox
                        getItems={[
                            {
                                src: row.original.image || imageError,
                            },
                        ]}
                    />
                </div>
            ),
            accessorKey: 'flag',
        },

        {
            header: t('labels.title'),
            Cell: ({ row }: { row: { original: MainCategory } }) => {
                const title = row.original?.title || '---';
                return <span>{title}</span>;
            },
            accessorKey: 'title',
        },

        {
            header: t('labels.order'),
            Cell: ({ row }: { row: { original: MainCategory } }) => {
                const ordering = row.original?.ordering || '---';
                return <span>{ordering}</span>;
            },
            accessorKey: 'ordering',
        },

        {
            header: t('labels.gender'),
            Cell: ({ row }: { row: { original: MainCategory } }) => {
                const gender = row.original?.gender || '---';
                return <span>{t(`labels.${gender}`)}</span>;
            },
            accessorKey: 'gender',
        },

        ...(hasPermission('update-MainCategory') || hasPermission('delete-MainCategory')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ renderedCellValue, row }: any) => (
                          <div
                              className="flex gap-2 items-center"
                              style={{ marginInlineStart: '1rem' }}
                          >
                              {hasPermission('update-MainCategory') && (
                                  <Link
                                      to={`/main-categories/edit/${row.original?.id}`}
                                      className="flex gap-5 "
                                  >
                                      <FaRegEdit className="text-[19px] text-warning ms-8" />
                                  </Link>
                              )}

                              {hasPermission('destroy-MainCategory') && (
                                  <CrudIconDelete
                                      deleteAction={() => {
                                          setMainCategoryId(row.original?.id);
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
    const endpoint = `main-categories?${searchParams.toString()}`;

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchMainCategoryData>({
        endpoint: endpoint,
        queryKey: [endpoint],
    });

    const { mutate: Delete } = useMutate({
        mutationKey: [`main-categories/${categoryId}`],
        endpoint: `main-categories/${categoryId}`,

        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', { name: t('breadcrumb.main_categories.title') }),
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
                title={t('breadcrumb.main_categories.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        {hasPermission('store-MainCategory') && (
                            <Link
                                to="/main-categories/add"
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
        </>
    );
}
