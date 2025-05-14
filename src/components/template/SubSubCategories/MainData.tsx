import { Skeleton } from '@mantine/core';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';
import GeneralSelect from '../../molecules/selects/GeneralSelect';
import { Label } from '../../atoms';
import NewUploadImgRepeaterAttachment from '../../atoms/NewUploadImgRepeaterAttachment';

export default function MainDataSubSubCategories({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();
    const { setFieldValue, values } = useFormikContext<{ [key: string]: any }>();

    return (
        <>
            <div className="grid grid-cols-12 gap-2">
                <div className="grid grid-cols-1 gap-2 col-span-12 mb-4">
                    <div className="flex flex-col items-center justify-center w-full my-4">
                        {isLoading ? (
                            <Skeleton height={100} circle />
                        ) : (
                            <>
                                <Label htmlFor="image" className="mb-1">
                                    {t('labels.image')}
                                </Label>

                                <NewUploadImgRepeaterAttachment
                                    isBinary={true}
                                    acceptFiles="image/png, image/jpeg, image/gif"
                                    name="image"
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
                            label={t('labels.order')}
                            name="ordering"
                            id="ordering"
                            type="number"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.order')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralSelect
                            name="category_id"
                            label={t('labels.main_category')}
                            placeholder={t('select') + ' ' + t('labels.main_category')}
                            apiName="main_categories_without_pagination"
                            onChange={(option: any) => setFieldValue('category_id', option)}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralSelect
                            disabled={!values.category_id}
                            name="sub_category_id"
                            label={t('labels.sub_category')}
                            placeholder={t('select') + ' ' + t('labels.sub_category')}
                            apiName={
                                values.category_id
                                    ? `get_sub_cat_of_main/${values.category_id}`
                                    : 'sub_categories_without_pagination'
                            }
                            onChange={(option: any) => setFieldValue('sub_category_id', option)}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
