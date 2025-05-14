import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye, FaPlus, FaRegEdit } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import LightBox from '../../components/molecules/LightBox/LightBox';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';
import FilterSection from '../../components/atoms/filters/Filters';
import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import CrudIconDelete from '../../components/molecules/CrudIconDelete';
import ModalCustom from '../../components/template/modal/ModalCustom';
import { hasPermission } from '../../helper/permissionHelpers';
import { useMutate } from '../../hooks/UseMutate';
import type { FetchData, Product } from './types';
import imageError from '/assets/images/logo.png';

export default function Products() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.products.title') },
    ];

    const [page, setPage] = useState<number>(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedDescription, setSelectedDescription] = useState<any>('');
    const [opened, setOpen] = useState<boolean>(false);
    const [productId, setProductId] = useState<Object>('');

    const typesList = [
        { id: 0, value: 'popular', label: t('status.popular') },
        { id: 1, value: 'new_in', label: t('status.new_in') },
    ];

    const columns: MRT_ColumnDef<Product>[] = [
        {
            header: '#',
            Cell: ({ row }: { row: { index: number } }) => row.index + 1,
            size: 40,
        },
        {
            header: t('labels.main_image'),
            Cell: ({ row }: { row: { original: Product } }) => (
                <div className="flex gap-5">
                    <LightBox
                        getItems={[
                            {
                                src: row.original.main_image?.media || imageError,
                            },
                        ]}
                    />
                </div>
            ),
            accessorKey: 'image',
        },

        {
            header: t('labels.title'),
            Cell: ({ row }: { row: { original: Product } }) => {
                const title = row.original.title || '---';
                return <span>{title}</span>;
            },
            accessorKey: 'title',
        },

        {
            header: t('labels.short_desc'),
            Cell: ({ row }: { row: { original: Product } }) => {
                const short_desc = row.original?.short_desc || '---';
                return (
                    <>
                        <FaEye
                            className="text-[19px] text-black ms-10 cursor-pointer"
                            onClick={() => {
                                setSelectedDescription(short_desc ?? '');
                                // setSelectedDescription(short_desc as string);
                                setOpen(true);
                            }}
                        />
                    </>
                );
            },

            accessorKey: 'short_desc',
        },

        {
            header: t('labels.main_category'),
            Cell: ({ row }: { row: { original: Product } }) => {
                const category = row.original.category?.title || '---';
                return <span>{category}</span>;
            },
            accessorKey: 'category',
        },

        {
            header: t('labels.sub_category'),
            Cell: ({ row }: { row: { original: Product } }) => {
                const sub_category = row.original.sub_category?.title || '---';
                return <span>{sub_category}</span>;
            },
            accessorKey: 'sub_category',
        },

        {
            header: t('labels.sub_subCategories'),
            Cell: ({ row }: { row: { original: Product } }) => {
                const sub_sub_category = row.original.sub_sub_category?.title || '---';
                return <span>{sub_sub_category}</span>;
            },
            accessorKey: 'sub_sub_category',
        },

        {
            header: t('labels.created_at'),
            Cell: ({ row }: { row: { original: Product } }) => {
                const created_at = row.original.created_at || '---';
                return <span>{created_at}</span>;
            },
            accessorKey: 'created_at',
        },

        ...(hasPermission('update-Product') ||
        hasPermission('delete-Product') ||
        hasPermission('show-Product')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ row }: { row: { original: Product } }) => (
                          <div className="flex gap-2 items-center ms-1">
                              {hasPermission('show-Product') && (
                                  <Link
                                      to={`/products/show/${row.original.id}`}
                                      className="flex gap-5"
                                  >
                                      <FaEye className="text-[19px] text-[#50cd89] ms-8" />
                                  </Link>
                              )}

                              {hasPermission('update-Product') && (
                                  <Link
                                      to={`/products/edit/${row.original?.id}`}
                                      className="flex gap-5 "
                                  >
                                      <FaRegEdit className="text-[19px] text-warning ms-8" />
                                  </Link>
                              )}
                              {hasPermission('delete-Product') && (
                                  <CrudIconDelete
                                      deleteAction={() => {
                                          setProductId(row.original?.id);
                                          deleteItem();
                                      }}
                                  />
                              )}
                          </div>
                      ),
                      accessorKey: 'actions',
                  },
              ]
            : []),
    ];

    const deleteItem = () => {
        showAlert(t('delete_confirmation'), '', false, t('ok'), true, 'warning', () => Delete({}));
    };

    const { mutate: Delete } = useMutate({
        mutationKey: [`products/${productId}`],
        endpoint: `products/${productId}`,

        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', { name: t('sidebar.products') }),
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
        keyword: searchParams.get('keyword') || '',
        type: searchParams.get('type') || '',
    };

    const buildEndpoint = (params: { keyword: string; type: string }) => {
        const queryParams = new URLSearchParams({ ...params, page: page.toString() });

        return `products?${queryParams.toString()}`;
    };

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchData>({
        endpoint: buildEndpoint(initialValues),
        queryKey: [buildEndpoint(initialValues)],
    });

    const handleReset = (
        resetForm: () => void,
        setFieldValue: (field: string, value: any) => void
    ) => {
        // Clear search params
        setSearchParams({});
        // Reset form values in Formik
        resetForm();
        // Explicitly reset the type field
        setFieldValue('type', '');
    };

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />

            {/* filter section */}
            <FilterSection
                initialValues={initialValues}
                optionsList={typesList}
                onSubmit={(values) => {
                    const params = {
                        keyword: values.keyword,
                        type: values.type,
                    };
                    setSearchParams(params);
                }}
                onReset={handleReset}
                isLoading={isLoading}
                keywords={['keyword']}
                selectKeys={['type']}
            />

            <TableCompCustom
                showOnly={true}
                columns={columns}
                data={terms?.data || []}
                paginationData={terms?.meta || []}
                title={t('breadcrumb.products.title')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        {hasPermission('store-Product') && (
                            <Link
                                to="/products/add"
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
            <ModalCustom opened={opened} setOpen={setOpen} title={t('labels.description')}>
                <div
                    dangerouslySetInnerHTML={{
                        __html: selectedDescription,
                    }}
                ></div>
            </ModalCustom>
        </>
    );
}
