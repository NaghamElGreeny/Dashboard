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
export default function SectionsMainData({
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
    const typesList = [
        {
            id: 0,
            value: 'about',
            label: t('labels.about'),
        },
        {
            id: 1,
            value: 'goals',
            label: t('labels.goals'),
        },
        {
            id: 2,
            value: 'core_values',
            label: t('labels.core_values'),
        },
        {
            id: 3,
            value: 'our_vision',
            label: t('labels.our_vision'),
        },
        {
            id: 4,
            value: 'terms',
            label: t('labels.terms'),
        },
        {
            id: 5,
            value: 'privacy_policy',
            label: t('labels.privacy_policy'),
        },
        {
            id: 6,
            value: 'our_services',
            label: t('labels.our_services'),
        },
        {
            id: 7,
            value: 'why_us',
            label: t('labels.why_us'),
        },
    ];
    // about - goals - core_values - our_vision - terms - privacy_policy - our_services - why_us

    //features 
    // const [features, setFeatures] = useState([
    //     { id: Date.now(), icon: null, titleAR: "", titleEN: "" },
    // ]);
    // const { setFieldValue, values } = useFormikContext<any>();
    const features = values.features || [];
    // const addFeature = () => {
    //     setFeatures([
    //         ...features,
    //         { id: Date.now(), icon: null, titleAR: "", titleEN: "" },
    //     ]);
    // };
    const addFeature = () => {
        setFieldValue('features', [
            ...features,
            { id: Date.now(), icon: null, ar: { value: "" }, en: { value: "" } }
        ]);
    };

    // const removeFeature = (id: any) => {
    //     setFeatures(features.filter((f) => f.id !== id));
    // };
    const removeFeature = (id: any) => {
        setFieldValue('features', features.filter((f: any) => f.id !== id));
    };


    // const updateFeature = (id: any, field: any, value: any) => {
    //     setFeatures((prev) =>
    //         prev.map((f) =>
    //             f.id === id ? { ...f, [field]: value } : f
    //         )
    //     );
    // };
    const updateFeature = (id: any, lang: 'ar' | 'en', value: string) => {
        const updated = features.map((f: any) =>
            f.id === id ? { ...f, [lang]: { value } } : f
        );
        setFieldValue('features', updated);
    };

    // const handleIconChange = (id: any, file: any) => {
    //     updateFeature(id, "icon", file);
    // };
    return (
        <>
            <div className="grid grid-cols-12 gap-2">

                <div className="flex flex-col col-span-12 sm:col-span-6 items-center justify-center w-full my-4">
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
                                model="Section"

                            />
                        </>
                    )}
                </div>
                <div className="flex flex-col col-span-12 sm:col-span-6 items-center justify-center w-full my-4">
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
                            dataOptions={typesList}
                            label={t('labels.type')}
                            placeholder={t('select') + ' ' + t('labels.type')}
                            onChange={(option: any) => setFieldValue('type', option?.value)}
                        />
                    )}
                </div>



                {/* <div className="grid grid-cols-1 gap-2 col-span-12 mb-4">
                </div> */}

            </div>
            <div className="flex items-center xl:gap-8 my-10">
                <div className="border border-border-primary flex-grow"></div>
                <p className="text-center text-primary text-xl mx-2">{t('labels.features')}</p>
                <div className="border border-border-primary flex-grow"></div>
            </div>

            {features.map((feature: any, index: any) => (
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

                            />
                        )}
                    </div>






                </div >
            ))
            }


        </>
    );
}
