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
import type { FetchWhyUsData, WhyUs } from './types';
import { hasPermission } from '../../helper/permissionHelpers';
import LightBox from '../../components/molecules/LightBox/LightBox';
import imageError from '/assets/images/logo.png';
import FilterSection from '../../components/atoms/filters/Filters';
import Lightbox from 'react-18-image-lightbox';
import { Switch } from '@mantine/core';

export default function WhyUs() {
    const { t, i18n } = useTranslation();
    const locale = localStorage.getItem('i18nextLng');
    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.about.title') },
    ];

    const [aboutId, setAboutId] = useState<Object>('');
    const [page, setPage] = useState<number>(1);
    const [searchParams, setSearchParams] = useSearchParams();

    const [opened, setOpen] = useState<boolean>(false);
    const [selectedDescription, setSelectedDescription] = useState<string>('');

    const columns: MRT_ColumnDef<WhyUs>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.icon'),
            Cell: ({ row }: { row: { original: WhyUs } }) => {
                const icon = row.original.icon;
                const [isOpen, setIsOpen] = useState(false);

                return (
                    <div className="flex gap-5">
                        {icon?.url ? (
                            <>
                                <img
                                    src={icon.url}
                                    alt="image"

                                    className="rounded-full w-20 h-20 object-cover cursor-pointer"
                                />

                                {isOpen && (
                                    <Lightbox
                                        mainSrc={icon.url}
                                        onCloseRequest={() => setIsOpen(false)}
                                    />
                                )}
                            </>
                        ) : (
                            <span>{t('not_found')}</span>
                        )}
                    </div>
                );
            },
            accessorKey: 'icon',
        }

        , {
            header: t('labels.value'),
            Cell: ({ row }: { row: { original: WhyUs } }) => {
                const value = row.original?.value || t('not_found');
                return <span>{value}</span>;
            },
            accessorKey: 'value',
        },
        {
            header: t('labels.title'),
            Cell: ({ row }: { row: { original: WhyUs } }) => {
                const description = locale === 'ar' ? row.original?.ar?.key : row.original?.en?.key || t('not_found');
                return <span>{description}</span>;
            },
            accessorKey: 'title',
        },
        {
            header: t('labels.status'),
            Cell: ({ row }: { row: { original: WhyUs } }) => {
                const [isActive, setIsActive] = useState(row.original?.is_active);

                const { mutate: toggleStatus } = useMutate({
                    mutationKey: [`why-us-toggle-${row.original.id}`],
                    endpoint: `why-us/${row.original.id}`,
                    method: 'put',
                    formData: true,
                    onSuccess: () => {
                        ShowAlertMixin({
                            type: 15,
                            icon: 'success',
                            title: t('status_updated'),
                        });
                        refetch(); // علشان نرجع البيانات الجديدة من السيرفر
                    },
                    onError: (err: any) => {
                        ShowAlertMixin({
                            type: 15,
                            icon: 'error',
                            title: err?.response?.data?.message,
                        });
                    },
                });

                const handleToggle = () => {
                    const newStatus = !isActive;
                    setIsActive(newStatus);
                    showAlert(t('toggle_status_confirmation'), '', false, t('ok'), true, 'warning', () => toggleStatus({
                        active: newStatus ? 1 : 0
                    }));
                };

                return (
                    <Switch
                        checked={isActive}
                        onChange={handleToggle}
                        color={isActive ? 'green' : 'gray'}
                    />
                );
            },
            accessorKey: 'active',
        },

        ...(hasPermission('update-About') || hasPermission('destroy-About')
            ? [
                {
                    header: t('labels.actions'),
                    Cell: ({ renderedCellValue, row }: any) => (
                        <div
                            className="flex gap-2 items-center"
                            style={{ marginInlineStart: '1rem' }}
                        >
                            {hasPermission('update-About') && (
                                <Link
                                    to={`/why-us/edit/${row.original?.id}`}
                                    className="flex gap-5"
                                >
                                    <FaRegEdit className="text-[19px] text-warning ms-8" />
                                </Link>
                            )}

                            {hasPermission('destroy-About') && (
                                <CrudIconDelete
                                    deleteAction={() => {
                                        setAboutId(row.original?.id);
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
        mutationKey: [`why-us/${aboutId}`],
        endpoint: `why-us/${aboutId}`,

        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', { name: t('breadcrumb.about.title') }),
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
        keyword: searchParams.get('keyword') || '',
    };

    const buildEndpoint = (params: { keyword: string }) => {
        const queryParams = new URLSearchParams({ ...params, page: page.toString() });

        return `why-us?${queryParams.toString()}`;
    };

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchWhyUsData>({
        endpoint: buildEndpoint(initialValues),
        queryKey: [buildEndpoint(initialValues)],
    });

    const handleReset = (resetForm: () => void) => {
        setSearchParams({});
        resetForm();
    };
    console.log('data', terms?.data);
    return (
        <>
            <Breadcrumb items={breadcrumbItems} />

            {/* filter section */}
            <FilterSection
                initialValues={initialValues}
                onSubmit={(values) => {
                    const params = {
                        keyword: values.keyword,
                    };
                    setSearchParams(params);
                }}
                onReset={handleReset}
                isLoading={isLoading}
                keywords={['keyword']}
            />

            <TableCompCustom
                showOnly={true}
                columns={columns}
                data={terms?.data || []}
                paginationData={terms?.meta || []}
                title={t('breadcrumb.about.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        {hasPermission('store-About') && (
                            <Link
                                to="/why-us/add"
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
