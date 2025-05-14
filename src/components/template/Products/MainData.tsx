import { Skeleton } from '@mantine/core';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { Label } from '../../atoms';
import { BaseInputField } from '../../atoms/BaseInputField';
import CKeditor from '../../atoms/EditorCustom';
import NewUploadImgRepeaterAttachment from '../../atoms/NewUploadImgRepeaterAttachment';
import GeneralSelect from '../../molecules/selects/GeneralSelect';
import GeneralStaticSelect from '../../molecules/selects/GeneralStaticSelect';
import ProductDetails from './ProductDetails';

export default function ProductsMainData({
    isLoading,
    refetch,
}: {
    isLoading?: boolean;
    refetch?: any;
}) {
    const { t } = useTranslation();

    const { setFieldValue, values } = useFormikContext<{
        [key: string]: any;
    }>();

    const trendyList = [
        {
            id: 0,
            value: 0,
            status: false,
            label: t('no'),
        },
        {
            id: 1,
            value: 1,
            status: true,
            label: t('yes'),
        },
    ];

    return (
        <>
            <div className="grid grid-cols-12 gap-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 col-span-12 mb-4">
                    <div className="flex flex-col items-center justify-center w-full my-4">
                        {isLoading ? (
                            <Skeleton height={100} circle />
                        ) : (
                            <>
                                <Label htmlFor="main_image" className="mb-1">
                                    {t('labels.main_image')}
                                </Label>

                                <NewUploadImgRepeaterAttachment
                                    acceptFiles="image/png, image/jpeg, image/gif"
                                    name="main_image"
                                    model="products"
                                />
                            </>
                        )}
                    </div>
                    <div className="flex flex-col items-center justify-center w-full my-4">
                        {isLoading ? (
                            <Skeleton height={100} circle />
                        ) : (
                            <>
                                <Label htmlFor="size_guide" className="mb-1">
                                    {t('labels.size_guide')}
                                </Label>

                                <NewUploadImgRepeaterAttachment
                                    acceptFiles="image/png, image/jpeg, image/gif"
                                    name="size_guide"
                                    model="products"
                                />
                            </>
                        )}
                    </div>
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.title') + t('inArabic')}
                            name="ar_title"
                            id="ar_title"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.title')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.title') + t('inEnglish')}
                            name="en_title"
                            id="en_title"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.title')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.short_desc') + t('inArabic')}
                            name="ar_short_desc"
                            id="ar_short_desc"
                            type="textarea"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.short_desc')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.short_desc') + t('inEnglish')}
                            name="en_short_desc"
                            id="en_short_desc"
                            type="textarea"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.short_desc')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={100} className="w-full" />
                    ) : (
                        <CKeditor
                            id="4"
                            name="ar_long_desc"
                            label={t('labels.long_desc') + t('inArabic')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={100} className="w-full" />
                    ) : (
                        <CKeditor
                            id="4"
                            name="en_long_desc"
                            label={t('labels.long_desc') + t('inEnglish')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralSelect
                            name="main_category_id"
                            label={t('labels.main_category')}
                            placeholder={t('select') + ' ' + t('labels.main_category')}
                            apiName="main_categories_without_pagination"
                            onChange={(option: any) => setFieldValue('main_category_id', option)}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralSelect
                            disabled={!values.main_category_id}
                            name="sub_category_id"
                            label={t('labels.sub_category')}
                            placeholder={t('select') + ' ' + t('labels.sub_category')}
                            apiName={
                                values.main_category_id
                                    ? `get_sub_cat_of_main/${values.main_category_id}`
                                    : 'sub_categories_without_pagination'
                            }
                            onChange={(option: any) => setFieldValue('sub_category_id', option)}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralSelect
                            disabled={!values.sub_category_id}
                            name="sub_sub_category_id"
                            label={t('labels.sub_subCategories')}
                            placeholder={t('select') + ' ' + t('labels.sub_subCategories')}
                            apiName={
                                values.sub_category_id
                                    ? `get_sub_cat_of_main/${values.sub_category_id}`
                                    : 'sub_sub_cat_without_pag'
                            }
                            onChange={(option: any) => setFieldValue('sub_sub_category_id', option)}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralSelect
                            name="brand_id"
                            label={t('labels.brands')}
                            placeholder={t('select') + ' ' + t('labels.brands')}
                            apiName="brands_without_pagination"
                            onChange={(option: any) => setFieldValue('brand_id', option)}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralStaticSelect
                            name="is_trendy"
                            dataOptions={trendyList}
                            label={t('labels.is_trendy')}
                            placeholder={t('select')}
                            onChange={(option: any) => setFieldValue('is_trendy', option?.value)}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralSelect
                            isMultiple={true}
                            name="complete_outfits"
                            label={t('labels.complete_outfits')}
                            placeholder={t('select') + ' ' + t('labels.complete_outfits')}
                            apiName={'products_without_pagination'}
                            onChange={(options: any) => setFieldValue('complete_outfits', options)}
                        />
                    )}
                </div>
            </div>

            {/* product_details */}
            <ProductDetails refetch={refetch} />
        </>
    );
}
