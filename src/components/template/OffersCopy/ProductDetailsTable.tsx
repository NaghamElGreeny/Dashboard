import { Radio } from '@mantine/core';
import { useTranslation } from 'react-i18next';

const ProductDetailsTable = ({
    data,
    index,
    values,
    setFieldValue,
    selectedRows,
    setSelectedRows,
    onChangeProductId,
}: {
    data: any[];
    index: number;
    values: any;
    setFieldValue: (field: string, value: any) => void;
    selectedRows: { [key: number]: number };
    setSelectedRows: React.Dispatch<React.SetStateAction<{ [key: number]: number }>>;
    onChangeProductId?: (e: any) => any;
}) => {
    const { t } = useTranslation();

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-dark rounded-lg">
                <thead className="bg-gray-50 dark:bg-darker">
                    <tr>
                        <th className="p-4 text-left">{t('select')}</th>
                        <th className="p-4 text-left">{t('labels.price')}</th>
                        <th className="p-4 text-left">{t('labels.quantity')}</th>
                        <th className="p-4 text-left">{t('labels.size')}</th>
                        <th className="p-4 text-left">{t('labels.color')}</th>
                        <th className="p-4 text-left">{t('labels.has_offer')}</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((item) => {
                        const isDisabled = item.has_offer; // Disable selection for rows with has_offer = true
                        return (
                            <tr
                                key={item.id}
                                className={`cursor-pointer 
                                    ${selectedRows[index] === item.id ? 'bg-gray-200' : ''} 
                                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} // Apply styles for disabled rows
                                onClick={() => {
                                    if (isDisabled) return; // Prevent selection if disabled

                                    setFieldValue(`products.${index}.product_detail_id`, item.id);
                                    setSelectedRows((prev) => ({
                                        ...prev,
                                        [index]: item.id,
                                    }));

                                    onChangeProductId?.({
                                        detail_id: item.id,
                                        product_id: values.products[index].product_id,
                                        discount: values.products[index].discount,
                                    });
                                }}
                            >
                                <td className="p-4">
                                    <Radio
                                        checked={
                                            values?.products[index]?.product_detail_id === item.id
                                        }
                                        name={`product-detail-${index}`}
                                        value={item.id}
                                        disabled={isDisabled} // Disable the radio input
                                        onChange={(e) => {
                                            if (isDisabled) return; // Prevent selection if disabled

                                            e.stopPropagation();

                                            setFieldValue(
                                                `products.${index}.product_detail_id`,
                                                item.id
                                            );

                                            setSelectedRows((prev) => ({
                                                ...prev,
                                                [index]: item.id,
                                            }));

                                            onChangeProductId?.({
                                                product_id: values.products[index].product_id,
                                                detail_id: item.id,
                                                discount: values.products[index].discount,
                                            });
                                        }}
                                    />
                                </td>
                                <td className="p-4">{item?.price || '---'}</td>
                                <td className="p-4">{item?.quantity || '---'}</td>
                                <td className="p-4">{item?.size?.title || '---'}</td>

                                <td className="p-4">
                                    {item.color?.hex ? (
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-6 h-6 rounded-full border"
                                                style={{
                                                    backgroundColor: item.color.hex,
                                                    borderColor:
                                                        item.color.hex.toLowerCase() === '#fff'
                                                            ? '#000'
                                                            : item.color.hex,
                                                }}
                                            />
                                            <span>{item?.color?.hex}</span>
                                        </div>
                                    ) : (
                                        '---'
                                    )}
                                </td>
                                <td className="p-4">
                                    <span
                                        className={`${
                                            item.has_offer ? 'active' : 'inactive'
                                        } statuses`}
                                    >
                                        {item.has_offer ? t('yes') : t('no')}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ProductDetailsTable;
