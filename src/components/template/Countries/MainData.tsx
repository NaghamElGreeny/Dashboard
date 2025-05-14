import { Skeleton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Label } from '../../atoms';
import { BaseInputField } from '../../atoms/BaseInputField';
import NewUploadImgRepeaterAttachment from '../../atoms/NewUploadImgRepeaterAttachment';

export default function MainDataCountries({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();

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
                                    model="Country"
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
                            label={t('labels.slug') + t('inArabic')}
                            name="ar_slug"
                            id="ar_slug"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.slug')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.slug') + t('inEnglish')}
                            name="en_slug"
                            id="en_slug"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.slug')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.currency') + t('inArabic')}
                            name="ar_currency"
                            id="ar_currency"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.currency')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.currency') + t('inEnglish')}
                            name="en_currency"
                            id="en_currency"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.currency')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.short_name')}
                            name="short_name"
                            id="short_name"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.short_name')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.phone_code')}
                            name="phone_code"
                            id="phone_code"
                            type="number"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.phone_code')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.phone_limit')}
                            name="phone_limit"
                            id="phone_limit"
                            type="number"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.phone_limit')}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
