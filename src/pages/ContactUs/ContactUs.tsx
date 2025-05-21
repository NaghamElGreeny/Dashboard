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
import useFetch from '../../hooks/UseFetch';
import { useMutate } from '../../hooks/UseMutate';
import type { FetchSectionData, Section } from './types';
import { hasPermission } from '../../helper/permissionHelpers';
import LightBox from '../../components/molecules/LightBox/LightBox';
import imageError from '/assets/images/logo.png';
import FilterSection from '../../components/atoms/filters/Filters';

export default function Sections() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.contact-info.title') },
    ];
    const [SectionsId, setSectionsId] = useState<Object>('');
    const [page, setPage] = useState<number>(1);
    const [searchParams, setSearchParams] = useSearchParams();

    const [opened, setOpen] = useState<boolean>(false);
    const [selectedDescription, setSelectedDescription] = useState<string>('');
    const locale = localStorage.getItem('i18nextLng');
    const columns: MRT_ColumnDef<Section>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.image'),
            Cell: ({ row }: { row: { original: Section } }) => (
                <div className="flex gap-5">
                    <LightBox
                        getItems={[
                            {
                                src: row.original.image?.url || 'imageError',
                            },
                        ]}
                    />

                </div>
            ),
            accessorKey: 'image',
        },
        {
            header: t('labels.icon'),
            Cell: ({ row }: { row: { original: Section } }) => (
                <div className="flex gap-5">
                    <LightBox
                        getItems={[
                            {
                                src: row.original.icon?.url || 'imageError',
                            },
                        ]} />
                </div>
            ),
            accessorKey: 'icon',
        },

        {
            header: t('labels.type'),
            Cell: ({ row }: { row: { original: Section } }) => {
                const type = row.original?.type || t('not_found');
                return <span>{t(`labels.${type}`)}</span>;
            },
            accessorKey: 'type',
        },
        {
            header: t('labels.title'),
            Cell: ({ row }: { row: { original: Section } }) => {
                const title = locale === 'ar' ? row.original?.ar?.title : row.original?.en?.title || t('not_found');
                return <span>{title}</span>;
            },
            accessorKey: 'title',
        },

        {
            header: t('labels.description'),
            Cell: ({ row }: { row: { original: Section } }) => {
                const description = locale === 'ar' ? row.original?.ar?.description : row.original?.en?.description || t('not_found');
                return (
                    <>
                        <FaEye
                            className="text-[19px] text-primary ms-10 cursor-pointer"
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
            accessorKey: 'status',
            header: t('labels.status'),
            Cell: ({ row }: { row: { original: Section } }) => {
                const status = row.original?.is_active ? t('labels.active') : t('labels.inactive');
                return (
                    <>
                        <span
                            className={`${row.original?.is_active ? 'active' : 'inactive'
                                } statuses `}
                        >
                            {status}
                        </span>

                    </>
                );
            },
        },

        ...(hasPermission('update-contacts') || hasPermission('destroy-contacts')
            ? [
                {
                    header: t('labels.actions'),
                    Cell: ({ renderedCellValue, row }: any) => (
                        <div
                            className="flex gap-2 items-center"
                            style={{ marginInlineStart: '1rem' }}
                        >
                            {hasPermission('update-Sections') && (
                                <Link
                                    to={`/sections?type=contact_info/edit/${row.original?.id}`}
                                    className="flex gap-5"
                                >
                                    <FaRegEdit className="text-[19px] text-warning ms-8" />
                                </Link>
                            )}

                            {hasPermission('destroy-Sections') && (
                                <CrudIconDelete
                                    deleteAction={() => {
                                        setSectionsId(row.original?.id);
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
        mutationKey: [`sections?type=contact_info/${SectionsId}`],
        endpoint: `sections?type=contact_info/${SectionsId}`,

        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', { name: t('breadcrumb.Sections.title') }),
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


    const initialValues = {
        type: searchParams.get('type') || '',
    };

    const buildEndpoint = (params: { type: string }) => {
        const queryParams = new URLSearchParams({ ...params, page: page.toString() });

        return `sections?type=contact_info${queryParams.toString()}`;
    };

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchSectionData>({
        endpoint: buildEndpoint(initialValues),
        queryKey: [buildEndpoint(initialValues)],
    });
    // console.log(terms?.data)
    const handleReset = (
        resetForm: () => void,
        setFieldValue: (field: string, value: any) => void
    ) => {
        // Clear search params
        setSearchParams({});
        // Reset form values in Formik
        resetForm();
        // Explicitly reset the status field
        setFieldValue('type', '');
    };

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />

            <TableCompCustom
                showOnly={true}
                columns={columns}
                data={terms?.data || []}
                paginationData={terms?.meta || []}
                title={t('breadcrumb.Sections.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        {hasPermission('store-Sections') && (
                            <Link
                                to="/sections/add"
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
