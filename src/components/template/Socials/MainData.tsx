import { Skeleton } from '@mantine/core';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { Label } from '../../atoms';
import { BaseInputField } from '../../atoms/BaseInputField';
import NewUploadImgRepeaterAttachment from '../../atoms/NewUploadImgRepeaterAttachment';

export default function MainDataSocials({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();
    const { setFieldValue, values } = useFormikContext<{ [key: string]: any }>();

    return (
        <>
            <div className="grid grid-cols-12 gap-2">
                {/* <div className="grid grid-cols-1 gap-2 col-span-12 mb-4">
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
                                    name="icon"
                                    model="socials"
                                />
                            </>
                        )}
                    </div>
                </div> */}

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.social_name')}
                            name="key"
                            id="key"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.social_name')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.social_link')}
                            name="value"
                            id="value"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.social_link')}
                        />
                    )}
                </div>
                {/* 
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
                        <BaseInputField
                            label={t('labels.link')}
                            name="link"
                            id="link"
                            type="url"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.link')}
                        />
                    )}
                </div> */}
            </div>
        </>
    );
}
