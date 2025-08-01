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
import FilterSection from '../../components/atoms/filters/Filters';
import LightBox from '../../components/molecules/LightBox/LightBox';
import { FetchSectionsData, Section } from '../Sections/types';

export default function ContactUs() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.contact_us.title') },
    ];

    const type = [
        {
            id: 0,
            value: 'contact_info',
            label: t('labels.contact_info'),
        },

    ];
    const [contactUsId, setContactUsId] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const locale = localStorage.getItem('i18nextLng');

    const [opened, setOpen] = useState<boolean>(false);
    const [selectedDescription, setSelectedDescription] = useState<string>('');
    const { mutate: updateStatus } = useMutate({
        mutationKey: [`sections/${contactUsId}`],
        endpoint: `sections/${contactUsId}`,
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
            Cell: ({ row }: { row: { original: Section } }) => {
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

                // function handleClick() {
                //     updateStatus({
                //         id: row.original?.id,
                //         is_active: !row.original?.is_active,
                //     });
                // }
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

        ...(hasPermission('update-contact-info') || hasPermission('delete-contact-info')
            ? [
                {
                    header: t('labels.actions'),
                    Cell: ({ row }: any) => (
                        <div
                            className="flex gap-2 items-center"
                            style={{ marginInlineStart: '1rem' }}
                        >
                            {hasPermission('contact-info.update') && (
                                <Link
                                    to={`/contact-info/edit/${row.original?.id}`}
                                    className="flex gap-5"
                                >
                                    <FaRegEdit className="text-[19px] text-warning ms-8" />
                                </Link>
                            )}

                            {hasPermission('contact-info.destroy') && (
                                <CrudIconDelete
                                    deleteAction={() => {
                                        setContactUsId(row.original?.id);
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

        return `sections?type=contact_info`;
    };

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchSectionsData>({
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
        mutationKey: [`sections/${contactUsId}`],
        endpoint: `sections/${contactUsId}`,
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
            {/* <FilterSection
                initialValues={initialValues}
                optionsList={type}
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
            /> */}

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
                                to="/contact-info/add"
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
