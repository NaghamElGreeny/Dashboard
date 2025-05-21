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
import { Feature } from '../../../pages/Sections/types';
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
    const features = values.features || [];
    const addFeature = () => {
        setFieldValue('features', [
            ...features,
            { id: Date.now(), icon: null, ar: { value: "" }, en: { value: "" } }
        ]);
    };

    const removeFeature = (id: any) => {
        setFieldValue('features', features.filter((f: any) => f.id !== id));
    };
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
                            label={t('labels.type')}
                            placeholder={t('select') + ' ' + t('labels.type')}
                            onChange={(option: any) => setFieldValue('type', option?.value)}
                        />
                    )}
                </div>


            </div>

            <div className="flex items-center xl:gap-8 my-10">
                <div className="border border-border-primary flex-grow"></div>
                <p className="text-center text-primary text-xl mx-2">{t('labels.features')}</p>
                <div className="border border-border-primary flex-grow"></div>
            </div>
            {features.map((feature: Feature, index: number) => (
                <div key={feature.id} className=" relative grid grid-cols-12 gap-2">
                    <div className="flex flex-col col-span-11  items-center justify-center w-full my-4">
                        {isLoading ? (
                            <Skeleton height={100} />
                        ) : (
                            <>
                                <Label htmlFor="icon" className="mb-1">
                                    {t('labels.icon')}
                                </Label>

                                <NewUploadImgRepeaterAttachment
                                    acceptFiles="image/png, image/jpeg, image/gif"
                                    name={`features[${index}].icon`}
                                    model="Feature"

                                />
                            </>
                        )}
                    </div>
                    {/* add & remove  */}
                    < div className='col-span-1 flex flex-col items-center justify-center gap-2 ' >
                        {index === (features.length - 1) &&
                            <button
                                type="button"
                                onClick={addFeature}
                                className="text-green-500 top-2 right-2"
                            >
                                <p className=' text-5xl font-bold'>+</p>
                            </button>
                        }
                        {features.length > 1 &&

                            <button
                                type="button"
                                onClick={() => removeFeature(feature.id)}
                                className="text-red-500  top-2 right-2 "
                            >
                                <p className=' text-5xl font-bold'>-</p>
                            </button>
                        }
                    </div>

                    {/* Title AR */}
                    <div className="col-span-12 sm:col-span-6 mb-2">
                        {isLoading ? (
                            <Skeleton height={40} className="w-full" />
                        ) : (
                            <BaseInputField
                                label={t('labels.title') + ' ' + (index + 1) + t('inArabic')}
                                name={`features[${index}].ar.value`}
                                id={`features[${index}].ar.value`}
                                type="text"
                                className="border"
                                placeholder={t('enter') + ' ' + t('labels.title')}
                                defaultValue={feature.ar.value}
                            />
                        )}
                    </div>

                    {/* Title EN */}
                    <div className="col-span-12 sm:col-span-6 mb-2">
                        {isLoading ? (
                            <Skeleton height={40} className="w-full" />
                        ) : (
                            <BaseInputField
                                label={t('labels.title') + ' ' + (index + 1) + t('inEnglish')}
                                name={`features[${index}].en.value`}
                                id={`features[${index}].en.value`}
                                type="text"
                                className="border"
                                placeholder={t('enter') + ' ' + t('labels.title')}
                                defaultValue={feature.en.value}
                            />
                        )}
                    </div>






                </div >
            ))
            }


        </>
    );
}
