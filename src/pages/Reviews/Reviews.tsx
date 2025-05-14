import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import CrudIconDelete from '../../components/molecules/CrudIconDelete';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';
import { useMutate } from '../../hooks/UseMutate';
import { FaEye } from 'react-icons/fa';
import ModalCustom from '../../components/template/modal/ModalCustom';
import Rating from '../../components/molecules/Rating/Rating';
import { Link } from 'react-router-dom';
import imageError from '/assets/images/logo.png';
import type { Review, FetchReviewData } from './types';
import { hasPermission } from '../../helper/permissionHelpers';

export default function Reviews() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.reviews.title') },
    ];

    const [reviewId, setRateId] = useState<Object>('');
    const [page, setPage] = useState(1);

    const [opened, setOpen] = useState<boolean>(false);
    const [selectedComment, setSelectedComment] = useState<string>('');

    const columns: MRT_ColumnDef<Review>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.user'),
            Cell: ({ row }: { row: { original: Review } }) => {
                const user_name = row.original?.user?.full_name || t('not_found');
                return (
                    <>
                        {hasPermission('show-Client')
                            ? [
                                  <Link
                                      to={`/clients/show/${row.original?.user?.id}`}
                                      className="flex items-center gap-2"
                                  >
                                      <img
                                          onError={(e: any) => (e.target.src = imageError)}
                                          src={row.original?.user?.image || imageError}
                                          className="cursor-pointer w-[50px] h-[50px] rounded-full"
                                      />

                                      <span>{user_name}</span>
                                  </Link>,
                              ]
                            : [
                                  <div className="flex items-center gap-2">
                                      <img
                                          onError={(e: any) => (e.target.src = imageError)}
                                          src={row.original?.user?.image || imageError}
                                          className="cursor-pointer w-[50px] h-[50px] rounded-full"
                                      />

                                      <span>{user_name}</span>
                                  </div>,
                              ]}
                    </>
                );
            },
            accessorKey: 'user',
        },

        // {
        //     header: t('labels.product'),
        //     Cell: ({ row }: { row: { original: Review } }) => (
        //         <div className="flex gap-2 items-center ms-1">
        //             <Link
        //                 to={`/products/show/${row.original?.product?.id}`}
        //                 className="text-blue-500 border-b border-blue-500 text-md"
        //             >
        //                 {t('labels.show_product')}
        //             </Link>
        //         </div>
        //     ),
        //     accessorKey: 'product',
        // },

        {
            header: t('labels.added_on'),
            Cell: ({ row }: { row: { original: Review } }) => {
                const created_at = row.original.created_at || t('not_found');
                return <span>{created_at}</span>;
            },
            accessorKey: 'created_at',
        },

        {
            header: t('labels.comment'),
            Cell: ({ row }: { row: { original: Review } }) => {
                const comment = row.original.comment || t('not_found');
                return (
                    <>
                        <FaEye
                            className="text-[19px] text-black ms-10 cursor-pointer"
                            onClick={() => {
                                setSelectedComment(comment ?? '');
                                setOpen(true);
                            }}
                        />
                    </>
                );
            },
            accessorKey: 'comment',
        },

        {
            header: t('labels.review'),
            Cell: ({ row }: { row: { original: Review } }) => (
                <Rating value={row.original.rate} onChange={row.original.rate} />
            ),
            accessorKey: 'review',
        },

        ...(hasPermission('destroy-Review')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ renderedCellValue, row }: any) => (
                          <div
                              className="flex gap-2 items-center"
                              style={{ marginInlineStart: '1rem' }}
                          >
                              <CrudIconDelete
                                  deleteAction={() => {
                                      setRateId(row.original?.id);
                                      deleteItem();
                                  }}
                              />
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
    const endpoint = `review/index?${searchParams.toString()}`;

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchReviewData>({
        endpoint: endpoint,
        queryKey: [endpoint],
    });

    const { mutate: Delete } = useMutate({
        mutationKey: [`review/delete/${reviewId}`],
        endpoint: `review/delete/${reviewId}`,

        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', { name: t('breadcrumb.reviews.title') }),
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
                title={t('breadcrumb.reviews.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
            />

            <ModalCustom opened={opened} setOpen={setOpen} title={t('labels.comment')}>
                <div>{selectedComment}</div>
            </ModalCustom>
        </>
    );
}
