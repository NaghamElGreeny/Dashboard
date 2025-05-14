import { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import TableCompCustom from '../../tantable/TableCutsom';
import { useTranslation } from 'react-i18next';
import { MRT_ColumnDef } from 'mantine-react-table';
import useFetch from '../../../../hooks/UseFetch';

interface SingleProductDetailsTableProps {
    name: string;
    productId: string | null;
    index: number;
    apiName?: string;
}

const SingleProductDetailsTable = ({
    name,
    productId,
    index,
    apiName = 'product_detail_for_product',
}: SingleProductDetailsTableProps) => {
    const { t } = useTranslation();
    const { values, setFieldValue } = useFormikContext<{ [key: string]: any }>();

    const [productDetailsMap, setProductDetailsMap] = useState<{ [key: string]: any }>({});

    // Fetch product details when productId changes
    const { data: productDetails } = useFetch<any>({
        endpoint: productId ? `${apiName}/${productId}` : '',
        // @ts-ignore
        queryKey: productId ? [`${apiName}/${productId}_${index}`] : [],
        enabled: !!productId,
    });

    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    useEffect(() => {
        if (productDetails) {
            setProductDetailsMap((prev) => ({
                ...prev,
                [index]: productDetails,
            }));
        }
    }, [productDetails, index]);

    useEffect(() => {
        const newData = values?.products?.[index]?.product_detail_id;
        if (newData) setSelectedRows([+newData]);
        else setSelectedRows([]);
    }, [values?.products]);

    const handleSelection = async (item: number) => {
        await setFieldValue(name, item);
        await setSelectedRows([item]);
    };

    // Determine selected row ID from form values
    // const selectedRowId = values?.products?.[index]?.product_detail_id || null;

    const columns: MRT_ColumnDef<any>[] = [
        // { header: '#', Cell: ({ row }: any) => row.index + 1, size: 40 },
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
        <TableCompCustom
            name={name}
            isEnableRowSelect={true}
            showOnly={true}
            columns={columns}
            data={productDetailsMap[index]?.data || []}
            selectedRowIds={selectedRows}
            onRowSelect={(selectedRowIds: any) => handleSelection(selectedRowIds[0])}
        />
    );
};

export default SingleProductDetailsTable;
