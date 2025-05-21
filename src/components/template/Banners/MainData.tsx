import { Skeleton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';
import CKeditor from '../../atoms/EditorCustom';
import { useFormikContext } from 'formik';
import NewUploadImgRepeaterAttachment from '../../atoms/NewUploadImgRepeaterAttachment';
import { Label } from '../../atoms';
import GeneralSelect from '../../molecules/selects/GeneralSelect';
import GeneralStaticSelect from '../../molecules/selects/GeneralStaticSelect';
import { TextAreaField } from '../../molecules';
import { useState } from 'react';
export default function BannersMainData({
    isLoading,
    formik,
    data,
}: {
    isLoading?: boolean;
    formik?: any;
    data?: any;
}) {
    const { t } = useTranslation();
    const { setFieldValue, values } = useFormikContext<any>();
    const bannerTypes = [
        { id: 0, value: 'main_banner', label: t('labels.main_banner') },
        { id: 1, value: 'about_banner', label: t('labels.about_banner') },
        { id: 2, value: 'our_services_banner', label: t('labels.our_services_banner') },
        { id: 3, value: 'qa_banner', label: t('labels.qa_banner') },
        { id: 4, value: 'contact_banner', label: t('labels.contact_banner') },
        { id: 5, value: 'terms_banner', label: t('labels.terms_banner') },
        { id: 6, value: 'privacy_banner', label: t('labels.privacy_banner') },
    ];
    return (
        <>
            <div className="grid grid-cols-12 gap-2">

                <div className="flex flex-col col-span-12 items-center justify-center w-full my-4">
                    {isLoading ? (
                        <Skeleton height={100} />
                    ) : (
                        <>
                            <Label htmlFor="image" className="mb-1">
                                {t('labels.image')}
                            </Label>

                            <NewUploadImgRepeaterAttachment
                                acceptFiles="image/png, image/jpeg, image/gif"
                                name="image"
                                model="Section"

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
                        <Skeleton height={100} className="w-full" />
                    ) : (
                        <TextAreaField
                            id="ar_description"
                            name="ar_description"
                            rows={5}
                            // type="text"
                            className="border"
                            label={t('labels.description') + t('inArabic')}
                            placeholder={t('enter') + ' ' + t('labels.description')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={100} className="w-full" />
                    ) : (
                        <TextAreaField
                            id=" en_description"
                            name="en_description"
                            rows={5}
                            // type="text"
                            className="border"
                            label={t('labels.description') + t('inEnglish')}
                            placeholder={t('enter') + ' ' + t('labels.description')}
                        />
                    )}
                </div>

                <div className="col-span-12">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralStaticSelect
                            name="type"
                            dataOptions={bannerTypes}
                            label={t('labels.banner_type')}
                            placeholder={t('select') + ' ' + t('labels.type')}
                            onChange={(option: any) => setFieldValue('type', option?.value)}
                        />
                    )}
                </div>


            </div>




        </>
    );
}
