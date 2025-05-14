import { Skeleton } from '@mantine/core';
import { FieldArray, useFormikContext } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useFetch from '../../../hooks/UseFetch';
import ProductDetailsTable from './ProductDetailsTable';
import GeneralCustomSelect from '../../molecules/selects/Products/GeneralCustomSelect';
import { BaseInputField } from '../../atoms/BaseInputField';
import { MdDelete } from 'react-icons/md';
import { IoAddCircleOutline } from 'react-icons/io5';
import { useParams } from 'react-router-dom';

const ProductDetailsFetcher = ({
    productId,
    index,
    onDataReceived,
    fetchedProductIds, // Pass previously fetched product IDs
    setFetchedProductIds, // Function to update fetched product IDs
}: {
    productId: string;
    index: number;
    onDataReceived: (index: number, data: any) => void;
    fetchedProductIds: Set<string>; // Track previously fetched products
    setFetchedProductIds: (newSet: Set<string>) => void; // Update function
}) => {
    // ✅ Prevent refetching if data was already fetched
    if (fetchedProductIds.has(productId)) {
        return null;
    }

    const { data } = useFetch<any>({
        endpoint: `product_detail_for_product/${productId}`,
        queryKey: [`product_detail_for_product/${productId}_${index}`],
        enabled: true,
    });

    useEffect(() => {
        if (data) {
            onDataReceived(index, data);

            // ✅ Mark this product ID as fetched to prevent re-calls
            const newFetchedProductIds = new Set(fetchedProductIds);
            newFetchedProductIds.add(productId);
            setFetchedProductIds(newFetchedProductIds);
        }
    }, [data, index, onDataReceived, productId]);

    return null;
};

export default function ProductsFieldArray({
    isLoading,
    initialProductIds,
    onChangeProductId,
}: {
    isLoading?: boolean;
    initialProductIds?: Array<{ product_id: string; product_detail_id: string; discount: number }>;
    onChangeProductId?: (e: any) => any;
}) {
    const { t } = useTranslation();
    const { values, setFieldValue } = useFormikContext<{ [key: string]: any }>();

    const id = useParams();

    const [productDetailsMap, setProductDetailsMap] = useState<{ [key: string]: any }>({});
    const [selectedRows, setSelectedRows] = useState<{ [key: number]: number }>({});
    const [activeProducts, setActiveProducts] = useState<
        Array<{ index: number; productId: string }>
    >([]);

    const handleDataReceived = useCallback((index: number, data: any) => {
        setProductDetailsMap((prev) => ({ ...prev, [index]: data }));
    }, []);

    useEffect(() => {
        if (initialProductIds?.length) {
            const products = initialProductIds.map((item, index) => ({
                index,
                productId: item.product_id,
            }));
            setActiveProducts(products);

            // ✅ Ensure selected product details are set correctly
            const newSelectedRows = initialProductIds.reduce((acc: any, item, index) => {
                acc[index] = item.product_detail_id;
                return acc;
            }, {} as { [key: number]: number });

            setSelectedRows(newSelectedRows);
        }
    }, [initialProductIds]);

    // Handle product selection change
    const handleProductChange = (option: any, index: number) => {
        setFieldValue(`products[${index}].product_id`, option.value);

        setActiveProducts((prev) => {
            const newList = [...prev];
            const existingIndex = newList.findIndex((item) => item.index === index);

            if (existingIndex !== -1) {
                newList[existingIndex] = { index, productId: option.value };
            } else {
                newList.push({ index, productId: option.value });
            }

            return newList;
        });
    };

    const [fetchedProductIds, setFetchedProductIds] = useState<Set<string>>(new Set());

    return (
        <>
            {/* Render product detail fetchers */}
            {activeProducts.map(({ index, productId }) => (
                <ProductDetailsFetcher
                    key={`${productId}_${index}`}
                    productId={productId}
                    index={index}
                    onDataReceived={handleDataReceived}
                    fetchedProductIds={fetchedProductIds}
                    setFetchedProductIds={setFetchedProductIds}
                />
            ))}

            <FieldArray name="products">
                {({ insert, remove, push }) => (
                    <div className="grid grid-cols-12 gap-2">
                        {values?.products?.length > 0 &&
                            values?.products?.map((productDetail: any, index: number) => (
                                <div key={index} className="col-span-12">
                                    <div
                                        key={productDetail.id || index}
                                        className="col-span-12 grid grid-cols-12 gap-2"
                                    >
                                        <div className="flex items-center xl:gap-8 my-4 mt-10 col-span-12">
                                            <div className="border border-border-primary flex-grow"></div>
                                            <p className="text-center text-secondary text-xl mx-2">
                                                {t('labels.product_details')}{' '}
                                                {values?.products?.length > 1 ? index + 1 : ''}
                                            </p>
                                            <div className="border border-border-primary flex-grow"></div>
                                        </div>

                                        <div className="px-6 py-3 rounded-2xl bg-white dark:bg-black grid grid-cols-12 gap-2 col-span-12">
                                            <div className="col-span-12">
                                                <BaseInputField
                                                    id={`products[${index}].discount`}
                                                    type="number"
                                                    placeholder={t('labels.discount')}
                                                    label={t('labels.discount')}
                                                    name={`products[${index}].discount`}
                                                    defaultValue={productDetail.discount}
                                                    onChange={(e: any) => {
                                                        if (onChangeProductId)
                                                            onChangeProductId({
                                                                detail_id: selectedRows[index],
                                                                discount: e.target.value,
                                                            });

                                                        setFieldValue(
                                                            `products[${index}].discount`,
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </div>

                                            {/* {id?.id && (
                                            <>
                                                <div className="col-span-6">
                                                    <BaseInputField
                                                        disabled={true}
                                                        id={`products[${index}].price_before_discount`}
                                                        type="number"
                                                        placeholder={t(
                                                            'labels.price_before_discount'
                                                        )}
                                                        label={t('labels.price_before_discount')}
                                                        name={`products[${index}].price_before_discount`}
                                                        defaultValue={
                                                            productDetail.price_before_discount
                                                        }
                                                    />
                                                </div>

                                                <div className="col-span-6">
                                                    <BaseInputField
                                                        disabled={true}
                                                        id={`products[${index}].price_after_discount`}
                                                        type="number"
                                                        placeholder={t(
                                                            'labels.price_after_discount'
                                                        )}
                                                        label={t('labels.price_after_discount')}
                                                        name={`products[${index}].price_after_discount`}
                                                        defaultValue={
                                                            productDetail.price_after_discount
                                                        }
                                                    />
                                                </div>
                                            </>
                                        )} */}

                                            <div className="col-span-12">
                                                <GeneralCustomSelect
                                                    name={`products[${index}].product_id`}
                                                    api="products_without_pagination"
                                                    label={t('labels.product')}
                                                    placeholder={
                                                        t('select') + ' ' + t('labels.product')
                                                    }
                                                    onChange={(option: any) =>
                                                        handleProductChange(option, index)
                                                    }
                                                    value={values.products[index].product_id}
                                                />
                                            </div>

                                            {values.products[index].product_id && (
                                                <div className="col-span-12 mt-5">
                                                    {isLoading ? (
                                                        <Skeleton height={100} className="w-full" />
                                                    ) : (
                                                        productDetailsMap[index] && (
                                                            <ProductDetailsTable
                                                                data={productDetailsMap[index].data}
                                                                index={index}
                                                                values={values}
                                                                setFieldValue={setFieldValue}
                                                                selectedRows={selectedRows}
                                                                setSelectedRows={setSelectedRows}
                                                                onChangeProductId={
                                                                    onChangeProductId
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            )}

                                            {values?.products?.length > 1 && (
                                                <div
                                                    className="col-span-12 flex items-center justify-center hover:cursor-pointer pt-4"
                                                    onClick={() => remove(index)}
                                                >
                                                    <MdDelete className="cursor-pointer text-[19px] text-red-500 me-2" />
                                                    <p className="text-[18px] font-bold px-2 text-red-500">
                                                        {t('buttons.delete')}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {index === values?.products?.length - 1 && (
                                        <div
                                            className="col-span-12 flex items-center justify-center hover:cursor-pointer pt-4"
                                            onClick={() =>
                                                push({
                                                    product_id: '',
                                                    discount: '',
                                                })
                                            }
                                        >
                                            <IoAddCircleOutline className="cursor-pointer text-[19px] text-[#50cd89]" />
                                            <p className="text-[18px] font-bold px-2 text-[#50cd89]">
                                                {t('labels.add_other_details')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                )}
            </FieldArray>
        </>
    );
}
