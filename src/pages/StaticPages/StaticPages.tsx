import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye, FaPlus, FaRegEdit } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import CrudIconDelete from '../../components/molecules/CrudIconDelete';
import ModalCustom from '../../components/template/modal/ModalCustom';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import { hasPermission } from '../../helper/permissionHelpers';
import useFetch from '../../hooks/UseFetch';
import { useMutate } from '../../hooks/UseMutate';
import type { FetchPagesData, Page } from './types';
import FilterSection from '../../components/atoms/filters/Filters';

export default function StaticPages() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.static_pages.title') },
    ];

    const pageTypes = [
        {
            id: 0,
            value: 'privacy_policy',
            label: t('labels.privacy_policy'),
        },
        {
            id: 1,
            value: 'terms',
            label: t('labels.terms-conditions'),
        },
    ];

    const [pageId, setPageId] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const locale = localStorage.getItem('i18nextLng');

    const [opened, setOpen] = useState<boolean>(false);
    const [selectedDescription, setSelectedDescription] = useState<string>('');
    const { mutate: updateStatus } = useMutate({
        mutationKey: [`sections/${pageId}`],
        endpoint: `sections/${pageId}`,
        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message || t('isUpdatedSuccessfully', { name: t('labels.status') }),
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
        method: 'put',
    });
    const columns: MRT_ColumnDef<Page>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.title'),
            Cell: ({ row }: { row: { original: Page } }) => {
                const title = locale === 'ar' ? row.original?.ar?.title : row.original?.en?.title || t('not_found');
                return <span>{title}</span>;
            },
            accessorKey: 'title',
        },

        {
            header: t('labels.description'),
            Cell: ({ row }: { row: { original: Page } }) => {
                const description = locale === 'ar' ? row.original?.ar?.description : row.original?.en?.description || t('not_found');
                return (
                    <>
                        <FaEye
                            className="text-[19px] text-black ms-10 cursor-pointer"
                            onClick={() => {
                                setSelectedDescription(description ?? '');
                                // setSelectedDescription(description as string);
                                setOpen(true);
                            }}
                        />
                    </>
                );
            },

            accessorKey: 'description',
        },

        {
            header: t('labels.type'),
            Cell: ({ row }: { row: { original: Page } }) => {
                const type = row.original?.type || '---';
                return <span>{t(`labels.${type}`)}</span>;
            },
            accessorKey: 'type',
        },

        {
            accessorKey: 'status',
            header: t('labels.status'),
            Cell: ({ row }: { row: { original: any } }) => {
                const status = row.original?.is_active ? t('labels.active') : t('labels.inactive');
                function handleClick() {
                    updateStatus({
                        id: row.original?.id,
                        is_active: !row.original?.is_active,
                    });
                }
                return (
                    <>
                        <button >

                            <span
                                className={`${row.original?.is_active ? 'active' : 'inactive'
                                    } statuses `}
                            >
                                {status}
                            </span>
                        </button>
                    </>
                );
            },
        },

        ...(hasPermission('update-Page') || hasPermission('delete-Page')
            ? [
                {
                    header: t('labels.actions'),
                    Cell: ({ row }: any) => (
                        <div
                            className="flex gap-2 items-center"
                            style={{ marginInlineStart: '1rem' }}
                        >
                            {hasPermission('static-pages.update') && (
                                <Link
                                    to={`/static-pages/edit/${row.original?.id}`}
                                    className="flex gap-5"
                                >
                                    <FaRegEdit className="text-[19px] text-warning ms-8" />
                                </Link>
                            )}

                            {hasPermission('static-pages.destroy') && (
                                <CrudIconDelete
                                    deleteAction={() => {
                                        setPageId(row.original?.id);
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

    const initialValues = {
        type: searchParams.get('type') || '',
        // keyword: searchParams.get('keyword') || '',
    };

    const buildEndpoint = (params: { type: string; }) => {
        const queryParams = new URLSearchParams({ ...params, page: page.toString() });

        return `listing/static-pages?${queryParams.toString()}`;
    };

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchPagesData>({
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

        // initialValues.keyword = '';
    };

    const { mutate: Delete } = useMutate({
        mutationKey: [`sections/${pageId}`],
        endpoint: `sections/${pageId}`,
        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', { name: t('breadcrumb.pages.title') }),
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

            {/* filter section */}
            <FilterSection
                initialValues={initialValues}
                optionsList={pageTypes}
                onSubmit={(values) => {
                    const params = {
                        type: values.type,
                        // keyword: values.keyword,
                    };
                    setSearchParams(params);
                }}
                onReset={handleReset}
                isLoading={isLoading}
                // keywords={['keyword']}
                selectKeys={['type']}
            />

            <TableCompCustom
                showOnly={true}
                columns={columns}
                data={terms?.data || []}
                paginationData={terms?.meta || []}
                title={t('breadcrumb.pages.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        {hasPermission('store-Page') && (
                            <Link
                                to="/static-pages/add"
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
                        __html: selectedDescription || t('not_found'),
                    }}
                ></div>
            </ModalCustom>
        </>
    );
}
