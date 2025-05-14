import { FieldArray, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { IoAddCircleOutline } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';
import GeneralCustomSelect from '../../molecules/selects/Products/GeneralCustomSelect';
import ProductDetailsTable from '../ProductDetails/SingleProductDetailsTable/SingleProductDetailsTable';
import { BaseInputField } from '../../atoms/BaseInputField';
import { useParams } from 'react-router-dom';

export default function ProductFieldArray() {
    const { t } = useTranslation();
    const { values, setFieldValue } = useFormikContext<{ [key: string]: any }>();

    const id = useParams();

    return (
        <FieldArray name="products">
            {({ insert, remove, push }) => (
                <div className="grid grid-cols-12 gap-2">
                    {values?.products?.length > 0 &&
                        values?.products?.map((productDetail: any, index: number) => (
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
                                            placeholder={t('select') + ' ' + t('labels.product')}
                                            onChange={(option: any) => {
                                                setFieldValue(
                                                    `products[${index}].product_id`,
                                                    option.value
                                                );
                                            }}
                                            value={productDetail.product_id}
                                        />
                                    </div>

                                    {productDetail.product_id && (
                                        <div className="col-span-12 mt-5">
                                            <ProductDetailsTable
                                                name={`products[${index}].product_detail_id`}
                                                productId={productDetail.product_id}
                                                index={index}
                                            />
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

                                {index === values?.products?.length - 1 && (
                                    <div
                                        className="col-span-12 flex items-center justify-center hover:cursor-pointer pt-4"
                                        onClick={() =>
                                            push({
                                                discount: '',
                                                product_id: '',
                                                product_detail_id: '',
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
    );
}
