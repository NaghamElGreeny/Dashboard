import { Skeleton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';
import CKeditor from '../../atoms/EditorCustom';
import { Label } from '../../atoms';
import NewUploadImgRepeaterAttachment from '../../atoms/NewUploadImgRepeaterAttachment';

export default function WhyUsMainData(
    {
        isLoading,
        formik,
        data,
    }: {
        isLoading?: boolean;
        formik?: any;
        data?: any;
    }
) {
    const { t } = useTranslation();

    return (
        <>
            <div className="grid grid-cols-1 gap-2">
                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.title') + t('inArabic')}
                            name="ar_key"
                            id="ar_key"
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
                            name="en_key"
                            id="en_key"
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
                            label={t('labels.value')}
                            name="value"
                            id="value"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.value')}
                        />
                    )}
                </div>

                <div className="flex flex-col items-center justify-center w-full my-4">
                    {isLoading ? (
                        <Skeleton height={100} />
                    ) : (
                        <>
                            <Label htmlFor="icon" className="mb-1">
                                {t('labels.icon')}
                            </Label>

                            <NewUploadImgRepeaterAttachment
                                acceptFiles="image/png, image/jpeg, image/gif"
                                name="icon"
                                model="User"

                            />
                        </>
                    )}
                </div>



            </div>
        </>
    );
}
