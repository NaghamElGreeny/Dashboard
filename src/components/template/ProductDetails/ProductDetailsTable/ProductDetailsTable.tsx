import { Skeleton } from '@mantine/core';
import { MRT_ColumnDef } from 'mantine-react-table';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useFetch from '../../../../hooks/UseFetch';
import TableCompCustom from '../../tantable/TableCutsom';

interface ProductDetailsTableProps {
    productId: string | null;
    isLoading: boolean | undefined;
    selectedRows: number[];
    setSelectedRows: (rows: number[]) => void;
    productDetails: any[];
}

export default function ProductDetailsTable({
    productId,
    isLoading,
    selectedRows,
    setSelectedRows,
    productDetails,
}: ProductDetailsTableProps) {
    const { t } = useTranslation();

    const { data: terms } = useFetch<any>({
        endpoint: productId ? `product_detail_for_product/${productId}` : '',

        // @ts-ignore
        queryKey: productId ? [`product_detail_for_product/${productId}`] : [],
        enabled: !!productId,
    });

    useEffect(() => {
        if (productDetails && terms?.data) {
            const selectedIds = productDetails.map((detail: any) => detail.id);
            const matchedRows = terms.data.filter((term: any) => selectedIds.includes(term.id));
            setSelectedRows(matchedRows.map((row: any) => row.id));
        }
    }, [terms?.data, productDetails]);

    const columns: MRT_ColumnDef<any>[] = [
        {
            header: t('labels.price'),
            Cell: ({ row }: any) => <span>{row.original.price || t('not_found')}</span>,
            accessorKey: 'price',
        },
        {
            header: t('labels.quantity'),
            Cell: ({ row }: any) => <span>{row.original.quantity || t('not_found')}</span>,
            accessorKey: 'quantity',
        },
        {
            header: t('labels.size'),
            Cell: ({ row }: any) => <span>{row.original.size?.title || t('not_found')}</span>,
            accessorKey: 'size',
        },
        {
            header: t('labels.color'),
            Cell: ({ row }: any) => {
                const hexColor = row.original?.color?.hex;
                return hexColor ? (
                    <div
                        style={{
                            backgroundColor: hexColor,
                            padding: '4px 8px',
                            borderRadius: '16px',
                            display: 'inline-block',
                            color: hexColor.toLowerCase() === '#fff' ? '#000' : '#fff',
                            border: hexColor.toLowerCase() === '#fff' ? '1px solid #000' : 'none',
                        }}
                    >
                        {hexColor}
                    </div>
                ) : (
                    <div className="text-red-500 font-medium">{t('not_found')}</div>
                );
            },
            accessorKey: 'colors',
        },
    ];

    return (
        <div className="col-span-12 mt-5">
            {isLoading ? (
                <Skeleton height={100} className="w-full" />
            ) : (
                <TableCompCustom
                    name="product_details"
                    isEnableRowSelect={true}
                    showOnly={true}
                    columns={columns}
                    data={terms?.data || []}
                    isLoading={isLoading}
                    selectedRowIds={selectedRows}
                />
            )}
        </div>
    );
}
