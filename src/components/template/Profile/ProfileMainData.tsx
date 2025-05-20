import { Skeleton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Label } from '../../atoms';
import { BaseInputField } from '../../atoms/BaseInputField';
import CustomPhoneInput from '../../atoms/CustomPhoneInput';
import NewUploadImgRepeaterAttachment from '../../atoms/NewUploadImgRepeaterAttachment';
import { CustomInputPhone } from '../../atoms/customphoneinput/CustomInputPhone';

export default function ProfileMainData({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();

    return (
        <>
            <div className="grid grid-cols-12 gap-2">
                {/* Image Upload */}
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
                                    model="User"
                                />
                            </>
                        )}
                    </div>
                </div>

                {/*  Name Input */}
                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.name')}
                            name="full_name"
                            id="full_name"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.name')}
                        />
                    )}
                </div>

                {/* Email Input */}
                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.email')}
                            name="email"
                            id="email"
                            type="email"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.email')}
                        />
                    )}
                </div>

                {/* Phone Input
                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <CustomInputPhone label={t('labels.phone')} name="phone" />
                    )}
                </div> */}
            </div>
        </>
    );
}
