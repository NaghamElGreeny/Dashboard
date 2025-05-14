import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye, FaPlus, FaRegEdit } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import LightBox from '../../components/molecules/LightBox/LightBox';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';
import type { Category, FetchCategoryData } from './types';
import { hasPermission } from '../../helper/permissionHelpers';
import CrudIconDelete from '../../components/molecules/CrudIconDelete';
import showAlert from '../../components/atoms/ShowAlert';
import { useMutate } from '../../hooks/UseMutate';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import ModalCustom from '../../components/template/modal/ModalCustom';
import FilterSection from '../../components/atoms/filters/Filters';

export default function Categories() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.categories.title') },
    ];

    const [categoryId, setCategoryId] = useState<Object>('');
    const [page, setPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();

    const [opened, setOpen] = useState<boolean>(false);
    const [selectedSubCategories, setSelectedSubCategories] = useState<string>('');

    const columns: MRT_ColumnDef<Category>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },
        {
            header: t('labels.image'),
            Cell: ({ row }: { row: { original: Category } }) => (
                <div className="flex gap-5">
                    <LightBox
                        getItems={[
                            {
                                src: row.original.image,
                                // title: row.original.image,
                            },
                        ]}
                    />
                </div>
            ),
            accessorKey: 'image',
        },
        {
            header: t('labels.title'),
            Cell: ({ row }: { row: { original: Category } }) => {
                const title = row.original?.title || t('not_found');
                return <span>{title}</span>;
            },
            accessorKey: 'title',
        },

        {
            header: t('labels.sub_categories'),
            Cell: ({ row }: { row: { original: Category } }) => {
                const subcategories = row.original?.subcategories || [];
                const subcategoryTitles = subcategories.map((item: any) => item.title).join(', '); // Extracting titles

                return (
                    <>
                        <FaEye
                            className="text-[19px] text-primary ms-10 cursor-pointer"
                            onClick={() => {
                                setSelectedSubCategories(subcategoryTitles ?? ''); // Setting titles in state
                                setOpen(true);
                            }}
                        />
                    </>
                );
            },
            accessorKey: 'subcategories',
        },

        ...(hasPermission('category.update') || hasPermission('category.destroy')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ renderedCellValue, row }: any) => (
                          <div
                              className="flex gap-2 items-center"
                              style={{ marginInlineStart: '1rem' }}
                          >
                              {hasPermission('category.update') && (
                                  <Link
                                      to={`/categories/edit/${row.original?.id}`}
                                      className="flex gap-5 "
                                  >
                                      <FaRegEdit className="text-[19px] text-warning ms-8" />
                                  </Link>
                              )}

                              {hasPermission('category.destroy') && (
                                  <CrudIconDelete
                                      deleteAction={() => {
                                          setCategoryId(row.original?.id);
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
        mutationKey: [`category/${categoryId}`],
        endpoint: `category/${categoryId}`,

        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', { name: t('breadcrumb.categories.title') }),
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
        category_name: searchParams.get('category_name') || '',
    };

    const buildEndpoint = (params: { category_name: string }) => {
        const queryParams = new URLSearchParams({ ...params, page: page.toString() });

        return `category?${queryParams.toString()}`;
    };

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchCategoryData>({
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
                        category_name: values.category_name,
                    };
                    setSearchParams(params);
                }}
                onReset={handleReset}
                isLoading={isLoading}
                keywords={['category_name']}
            />

            <TableCompCustom
                showOnly={true}
                columns={columns}
                data={terms?.data || []}
                paginationData={terms?.meta || []}
                title={t('breadcrumb.categories.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        {hasPermission('category.store') && (
                            <Link
                                to="/categories/add"
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

            <ModalCustom opened={opened} setOpen={setOpen} title={t('labels.sub_categories')}>
                <div>
                    {selectedSubCategories ? (
                        selectedSubCategories.split(',').map((category, index) => (
                            <div key={index} className="flex items-center gap-2 my-2">
                                <span className="text-lg font-semibold">{index + 1}.</span>
                                {/* Display index */}
                                <span>{category.trim()}</span> {/* Display category title */}
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
