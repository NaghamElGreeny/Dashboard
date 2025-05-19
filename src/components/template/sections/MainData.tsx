import { Skeleton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';
import CKeditor from '../../atoms/EditorCustom';
import { useFormikContext } from 'formik';
import NewUploadImgRepeaterAttachment from '../../atoms/NewUploadImgRepeaterAttachment';
import { Label } from '../../atoms';
import GeneralSelect from '../../molecules/selects/GeneralSelect';
import GeneralStaticSelect from '../../molecules/selects/GeneralStaticSelect';
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
    return (
        <>
            <div className="grid grid-cols-12 gap-2">
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
                        <BaseInputField
                            id="ar_description"
                            name="ar_description"
                            type="text"
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
                        <BaseInputField
                            id=" en_description"
                            name="en_description"
                            type="text"
                            className="border"
                            label={t('labels.description') + t('inEnglish')}
                            placeholder={t('enter') + ' ' + t('labels.description')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
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

                <div className="grid grid-cols-2 gap-2 col-span-12 mb-4">
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
                                    model="Section"

                                />
                            </>
                        )}
                    </div>
                    <div className="flex flex-col items-center justify-center w-full my-4">
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
                </div>
                {/* <div className="grid grid-cols-1 gap-2 col-span-12 mb-4">
                </div> */}

            </div>
        </>
    );
}
