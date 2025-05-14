import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaRegEdit } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';
import type { FetchSubCategoryData, SubCategory } from './types';
import { hasPermission } from '../../helper/permissionHelpers';
import CrudIconDelete from '../../components/molecules/CrudIconDelete';
import showAlert from '../../components/atoms/ShowAlert';
import { useMutate } from '../../hooks/UseMutate';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import LightBox from '../../components/molecules/LightBox/LightBox';
import imageError from '/assets/images/logo.png';
import FilterSection from '../../components/atoms/filters/Filters';

export default function SubCategories() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.sub_categories.title') },
    ];

    const [subCategoryId, setSubCategoryId] = useState<Object>('');
    const [page, setPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();

    const columns: MRT_ColumnDef<SubCategory>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.image'),
            Cell: ({ row }: { row: { original: SubCategory } }) => (
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
            Cell: ({ row }: { row: { original: SubCategory } }) => {
                const title = row.original?.title || '---';
                return <span>{title}</span>;
            },
            accessorKey: 'title',
        },

        ...(hasPermission('subcategory.update') || hasPermission('subcategory.destroy')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ renderedCellValue, row }: any) => (
                          <div
                              className="flex gap-2 items-center"
                              style={{ marginInlineStart: '1rem' }}
                          >
                              {hasPermission('subcategory.update') && (
                                  <Link
                                      to={`/sub-categories/edit/${row.original?.id}`}
                                      className="flex gap-5"
                                  >
                                      <FaRegEdit className="text-[19px] text-warning ms-8" />
                                  </Link>
                              )}

                              {hasPermission('subcategory.destroy') && (
                                  <CrudIconDelete
                                      deleteAction={() => {
                                          setSubCategoryId(row.original?.id);
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
        mutationKey: [`subcategory/${subCategoryId}`],
        endpoint: `subcategory/${subCategoryId}`,

        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', { name: t('breadcrumb.sub_categories.title') }),
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

    const initialValues = {
        subcategory_name: searchParams.get('subcategory_name') || '',
    };

    const buildEndpoint = (params: { subcategory_name: string }) => {
        const queryParams = new URLSearchParams({ ...params, page: page.toString() });

        return `subcategory?${queryParams.toString()}`;
    };

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchSubCategoryData>({
        endpoint: buildEndpoint(initialValues),
        queryKey: [buildEndpoint(initialValues)],
    });

    const handleReset = (resetForm: () => void) => {
        setSearchParams({});
        resetForm();
    };

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />

            {/* filter section */}
            <FilterSection
                initialValues={initialValues}
                onSubmit={(values) => {
                    const params = {
                        subcategory_name: values.subcategory_name,
                    };
                    setSearchParams(params);
                }}
                onReset={handleReset}
                isLoading={isLoading}
                keywords={['subcategory_name']}
            />

            <TableCompCustom
                showOnly={true}
                columns={columns}
                data={terms?.data || []}
                paginationData={terms?.meta || []}
                title={t('breadcrumb.sub_categories.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        {hasPermission('subcategory.store') && (
                            <Link
                                to="/sub-categories/add"
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
