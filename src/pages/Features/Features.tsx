import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye, FaPlus, FaRegEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import CrudIconDelete from '../../components/molecules/CrudIconDelete';
import ModalCustom from '../../components/template/modal/ModalCustom';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';
import { useMutate } from '../../hooks/UseMutate';
import type { Feature, FetchFeaturesData } from './types';
import { hasPermission } from '../../helper/permissionHelpers';
import themeConfig from '../../theme.config';

export default function Features() {
    const { t, i18n } = useTranslation();
    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.faqs.title') },
    ];

    const [faqId, setFaqId] = useState<Object>('');
    const [page, setPage] = useState(1);
    const [opened, setOpen] = useState<boolean>(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const locale = localStorage.getItem('i18nextLng');
    const columns: MRT_ColumnDef<Feature>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.title'),
            Cell: ({ row }: { row: { original: Feature } }) => {
                const question = locale === 'ar' ? row.original?.ar?.title : row.original?.en?.title || 'title not found';
                const truncatedQuestion =
                    typeof question === 'string' && question.length > 20
                        ? question.substring(0, 20) + ' '
                        : question;

                return (
                    <>
                        <span>{truncatedQuestion}</span>
                        {typeof question === 'string' && question.length > 20 && (
                            <span
                                className="text-primary font-bold cursor-pointer ms-2"
                                onClick={() => {
                                    setSelectedAnswer(question ?? '');
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

        {
            header: t('labels.description'),
            Cell: ({ row }: { row: { original: Feature } }) => {
                const answer = locale === 'ar' ? row.original?.ar.description : row.original?.en.description || t('not_found');
                return (
                    <>
                        <FaEye
                            className="text-[19px] text-primary ms-10 cursor-pointer"
                            onClick={() => {
                                setSelectedAnswer(answer ?? '');
                                setOpen(true);
                            }}
                        />
                    </>
                );
            },
            accessorKey: 'description',
        },

        ...(hasPermission('feature.update') || hasPermission('feature.destroy')
            ? [
                {
                    header: t('labels.actions'),
                    Cell: ({ renderedCellValue, row }: any) => (
                        <div
                            className="flex gap-2 items-center"
                            style={{ marginInlineStart: '1rem' }}
                        >
                            {hasPermission('faq.update') && (
                                <Link
                                    to={`/faq/edit/${row.original?.id}`}
                                    className="flex gap-5"
                                >
                                    <FaRegEdit className="text-[19px] text-warning ms-8" />
                                </Link>
                            )}
                            {hasPermission('faq.destroy') && (
                                <CrudIconDelete
                                    deleteAction={() => {
                                        setFaqId(row.original?.id);
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
        mutationKey: [`our-features/${faqId}`],
        endpoint: `our-features/${faqId}`,

        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', { name: t('breadcrumb.features.title') }),
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
    const endpoint = `our-features?${searchParams.toString()}`;
    // const endpoint = `faq`;

    const {
        data: features,
        refetch,
        isLoading,
    } = useFetch<FetchFeaturesData>({
        endpoint: endpoint,
        queryKey: [endpoint],
    });
    // console.log(featuress?.data);

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <TableCompCustom
                showOnly={true}
                columns={columns}
                data={features?.data || []}
                paginationData={features?.meta || []}
                title={t('breadcrumb.features.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        {hasPermission('features.store') && (
                            <Link
                                to="/features/add"
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

            <ModalCustom opened={opened} setOpen={setOpen} title={t('labels.answer')}>
                <div
                    dangerouslySetInnerHTML={{
                        __html: selectedAnswer || t('not_found'),
                    }}
                >

                </div>
            </ModalCustom>
        </>
    );
}
