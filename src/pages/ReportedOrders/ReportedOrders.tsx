import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import ModalCustom from '../../components/template/modal/ModalCustom';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';
import { FetchData, Order } from './types';
import imageError from '/assets/images/logo.png';
import LightBox from '../../components/molecules/LightBox/LightBox';
import { hasPermission } from '../../helper/permissionHelpers';

export default function ReportedOrders() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.reported_orders.title') },
    ];

    const [page, setPage] = useState<number>(1);
    const [selectedDescription, setSelectedDescription] = useState<string>('');
    const [opened, setOpen] = useState<boolean>(false);

    const columns: MRT_ColumnDef<Order>[] = [
        {
            header: '#',
            Cell: ({ row }: { row: { index: number } }) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.order_no'),
            accessorKey: 'order_no',
            Cell: ({ row }: { row: { original: Order } }) => {
                const order_no = row.original.id || '---';
                return <span className="text-success font-medium">#{order_no}</span>;
            },
            size: 40,
        },

        {
            header: t('labels.image'),
            Cell: ({ row }: { row: { original: Order } }) => (
                <div className="flex gap-5">
                    <LightBox
                        getItems={[
                            {
                                src: row.original.image || imageError,
                                // title: row.original.image,
                            },
                        ]}
                    />
                </div>
            ),
            accessorKey: 'image',
        },

        {
            header: t('labels.buyer'),
            Cell: ({ row }: { row: { original: Order } }) => {
                const buyer_name = row.original?.buyer?.name || '---';
                return (
                    <>
                        {hasPermission('show-Client')
                            ? [
                                  <Link
                                      to={`/clients/show/${row.original?.buyer?.buyer_id}`}
                                      className="flex items-center gap-2"
                                  >
                                      <img
                                          onError={(e: any) => (e.target.src = imageError)}
                                          src={row.original?.buyer?.image || imageError}
                                          className="cursor-pointer w-[50px] h-[50px] rounded-full"
                                      />

                                      <span>{buyer_name}</span>
                                  </Link>,
                              ]
                            : [
                                  <div className="flex items-center gap-2">
                                      <img
                                          onError={(e: any) => (e.target.src = imageError)}
                                          src={row.original?.buyer?.image || imageError}
                                          className="cursor-pointer w-[50px] h-[50px] rounded-full"
                                      />

                                      <span>{buyer_name}</span>
                                  </div>,
                              ]}
                    </>
                );
            },
            accessorKey: 'buyer',
        },

        {
            header: t('labels.product'),
            Cell: ({ row }: { row: { original: Order } }) => (
                <div className="flex gap-2 items-center ms-1">
                    {hasPermission('show-Product')
                        ? [
                              <Link
                                  to={`/products/show/${row.original?.product?.id}`}
                                  className="text-blue-500 border-b border-blue-500 text-md"
                              >
                                  {row?.original?.product?.name}
                              </Link>,
                          ]
                        : [<span>{row?.original?.product?.name}</span>]}
                </div>
            ),
            accessorKey: 'product',
        },

        {
            header: t('labels.product_buyers_count'),
            Cell: ({ row }: { row: { original: Order } }) => {
                const product_buyers_count = row.original.product_buyers_count || '---';
                return <span>{product_buyers_count}</span>;
            },
            accessorKey: 'product_buyers_count',
        },

        {
            header: t('labels.quantity'),
            Cell: ({ row }: { row: { original: Order } }) => {
                const quantity = row.original.quantity || '---';
                return <span>{quantity}</span>;
            },
            accessorKey: 'quantity',
        },

        {
            accessorKey: 'status',
            header: t('labels.status'),
            Cell: ({ row }: { row: { original: Order } }) => {
                const status = row.original?.status_translated;
                // const status = t(`status.${row.original?.status}`) || '---';
                return <span className={`${row.original?.status} statuses`}>{status}</span>;
            },
        },

        ...(hasPermission('orderDetails-Order')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ row }: { row: { original: Order } }) => (
                          <div className="flex gap-2 items-center ms-1">
                              <Link to={`/orders/show/${row.original?.id}`} className="flex gap-5">
                                  <FaEye className="text-[19px] text-[#50cd89] ms-8" />
                              </Link>
                          </div>
                      ),
                      accessorKey: 'actions',
                  },
              ]
            : []),
    ];

    const queryParams = {
        page: page.toString(),
    };

    const searchParams = new URLSearchParams(queryParams);
    const endpoint = `order/reported-orders?${searchParams.toString()}`;

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchData>({
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
                title={t('breadcrumb.reported_orders.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
            />
            <ModalCustom opened={opened} setOpen={setOpen} title={t('labels.description')}>
                <div>{selectedDescription}</div>
            </ModalCustom>
        </>
    );
}
