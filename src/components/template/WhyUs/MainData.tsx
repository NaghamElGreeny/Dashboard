import { Skeleton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';
import CKeditor from '../../atoms/EditorCustom';
import { Label } from '../../atoms';
import NewUploadImgRepeaterAttachment from '../../atoms/NewUploadImgRepeaterAttachment';
import GeneralStaticSelect from '../../molecules/selects/GeneralStaticSelect';
import { useFormikContext } from 'formik';

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
    const { setFieldValue, values } = useFormikContext<any>();
    const activeStatus = [
        { id: 0, value: 0, label: t('labels.inactive') },
        { id: 1, value: 1, label: t('labels.active') },]
    return (
        <>
            <div className="grid grid-cols-12 gap-2">

                <div className="flex flex-col col-span-12 items-center justify-center w-full my-4">
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
                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralStaticSelect
                            name="is_active"
                            dataOptions={activeStatus}
                            label={t('labels.status')}
                            placeholder={t('select') + ' ' + t('labels.type')}
                            onChange={(option: any) => setFieldValue('is_active', option?.value)}
                        />
                    )}
                </div>


            </div>
        </>
    );
}
