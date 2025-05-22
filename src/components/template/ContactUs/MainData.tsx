import { Skeleton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';
import { useFormikContext } from 'formik';
import GeneralStaticSelect from '../../molecules/selects/GeneralStaticSelect';
import NewUploadImgRepeaterAttachment from '../../atoms/NewUploadImgRepeaterAttachment';
import { Label } from '../../atoms';

export default function MainDataContactUs({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();
    const { setFieldValue, values } = useFormikContext<{ [key: string]: any }>();


    const type = [
        {
            id: 0,
            value: 'contact_info',
            label: t('labels.contact_info'),
        },

    ];


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
                <div className="col-span-12 hidden">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralStaticSelect
                            name="type"
                            dataOptions={type}
                            label={t('labels.type')}
                            placeholder={t('select') + ' ' + t('labels.type')}
                            // onChange={(option: any) => setFieldValue('type', option?.value)}
                            value={type.find((option) => option.value === values.type) || null}
                        />

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
                            aria-rowspan={5}
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.description')}
                        />
                    )}
                </div>


            </div>
        </>
    );
}
