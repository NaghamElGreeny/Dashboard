import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaRegEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';
import type { FetchSubSubCategoryData, SubSubCategory } from './types';
import { hasPermission } from '../../helper/permissionHelpers';
import CrudIconDelete from '../../components/molecules/CrudIconDelete';
import showAlert from '../../components/atoms/ShowAlert';
import { useMutate } from '../../hooks/UseMutate';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import LightBox from '../../components/molecules/LightBox/LightBox';
import imageError from '/assets/images/logo.png';

export default function SubSubCategories() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.sub_subCategories.title') },
    ];

    const [subSubCategoryId, setSubSubCategoryId] = useState<Object>('');
    const [page, setPage] = useState(1);

    const columns: MRT_ColumnDef<SubSubCategory>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.image'),
            Cell: ({ row }: { row: { original: SubSubCategory } }) => (
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
            Cell: ({ row }: { row: { original: SubSubCategory } }) => {
                const title = row.original?.title || '---';
                return <span>{title}</span>;
            },
            accessorKey: 'title',
        },

        {
            header: t('labels.order'),
            Cell: ({ row }: { row: { original: SubSubCategory } }) => {
                const ordering = row.original?.ordering || '---';
                return <span>{ordering}</span>;
            },
            accessorKey: 'ordering',
        },

        {
            header: t('labels.main_category'),
            Cell: ({ row }: any) => {
                const main_category = row.original?.category?.title || t('not_found');
                return <span>{main_category}</span>;
            },
            accessorKey: 'main_category',
        },

        {
            header: t('labels.sub_category'),
            Cell: ({ row }: any) => {
                const sub_category = row.original?.subcategory?.title || t('not_found');
                return <span>{sub_category}</span>;
            },
            accessorKey: 'sub_category',
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
                                      to={`/sub-subCategories/edit/${row.original?.id}`}
                                      className="flex gap-5"
                                  >
                                      <FaRegEdit className="text-[19px] text-warning ms-8" />
                                  </Link>
                              )}

                              {hasPermission('destroy-MainCategory') && (
                                  <CrudIconDelete
                                      deleteAction={() => {
                                          setSubSubCategoryId(row.original?.id);
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

    const { mutate: Delete } = useMutate({
        mutationKey: [`sub_sub_categories/${subSubCategoryId}`],
        endpoint: `sub_sub_categories/${subSubCategoryId}`,

        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', { name: t('breadcrumb.sub_subCategories.title') }),
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

    const queryParams = {
        page: page,
    };

    const searchParams = new URLSearchParams(queryParams as any);
    const endpoint = `sub_sub_categories?${searchParams.toString()}`;

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchSubSubCategoryData>({
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
                title={t('breadcrumb.sub_subCategories.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        <Link
                            to="/sub-subCategories/add"
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
