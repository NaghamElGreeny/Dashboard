import { Skeleton } from '@mantine/core';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { Label } from '../../atoms';
import { BaseInputField } from '../../atoms/BaseInputField';
import NewUploadImgRepeaterAttachment from '../../atoms/NewUploadImgRepeaterAttachment';
import GeneralSelect from '../../molecules/selects/GeneralSelect';
import GeneralStaticSelect from '../../molecules/selects/GeneralStaticSelect';
import ProductFieldArray from './ProductsFieldArray';

export default function MainDataSliders({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();
    const { setFieldValue, values } = useFormikContext<{ [key: string]: any }>();

    const statusList = [
        {
            id: 0,
            value: 0,
            status: false,
            label: t('labels.inactive'),
        },
        {
            id: 1,
            value: 1,
            status: true,
            label: t('labels.active'),
        },
    ];

    const sliderTypes = [
        {
            id: 0,
            value: 'header',
            label: t('labels.header'),
        },
        {
            id: 1,
            value: 'footer',
            label: t('labels.footer'),
        },
    ];

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
                                    acceptFiles="image/png, image/jpeg, image/gif"
                                    name="image"
                                    model="sliders"
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
                            label={t('labels.name') + t('inArabic')}
                            name="ar_name"
                            id="ar_name"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.name')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.name') + t('inEnglish')}
                            name="en_name"
                            id="en_name"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.name')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.description') + t('inArabic')}
                            name="ar_description"
                            id="ar_description"
                            type="textarea"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.description')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.description') + t('inEnglish')}
                            name="en_description"
                            id="en_description"
                            type="textarea"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.description')}
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
                        <GeneralStaticSelect
                            name="is_active"
                            dataOptions={statusList}
                            label={t('labels.status')}
                            placeholder={t('select') + ' ' + t('labels.status')}
                            onChange={(option: any) => setFieldValue('is_active', option?.value)}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralStaticSelect
                            name="slider_type"
                            dataOptions={sliderTypes}
                            label={t('labels.slider_type')}
                            placeholder={t('select') + ' ' + t('labels.slider_type')}
                            onChange={(option: any) => setFieldValue('slider_type', option?.value)}
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

                {/* products */}
                <div className="col-span-12">
                    <ProductFieldArray />
                </div>
            </div>
        </>
    );
}
