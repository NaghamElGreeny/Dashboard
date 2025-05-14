import { Skeleton } from '@mantine/core';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';
import GeneralSelect from '../../molecules/selects/GeneralSelect';
import GeneralStaticSelect from '../../molecules/selects/GeneralStaticSelect';
import GoogleMapFormField from '../../molecules/googleMap/GoogleMapFormField';
import { Label } from '../../atoms';
import NewUploadImgRepeaterAttachment from '../../atoms/NewUploadImgRepeaterAttachment';

export default function MainDataCities({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();

    const { setFieldValue } = useFormikContext<{ [key: string]: any }>();

    const statusList = [
        {
            id: 0,
            value: 0,
            status: false,
            label: t('no'),
        },
        {
            id: 1,
            value: 1,
            status: true,
            label: t('yes'),
        },
    ];

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
                                    model="City"
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
                            label={t('labels.postal_code')}
                            name="postal_code"
                            id="postal_code"
                            type="number"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.postal_code')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.short_cut')}
                            name="short_cut"
                            id="short_cut"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.short_cut')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.location')}
                            name="location"
                            id="location"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.location')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralSelect
                            isGeneral={true}
                            label={t('labels.country')}
                            placeholder={t('select') + ' ' + t('labels.country')}
                            apiName="countries/list-without-pag"
                            name="country_id"
                            onChange={(option: any) => setFieldValue('country_id', option)}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralStaticSelect
                            name="offline_session_availability"
                            dataOptions={statusList}
                            label={t('labels.offline_session_availability')}
                            placeholder={
                                t('select') + ' ' + t('labels.offline_session_availability')
                            }
                            onChange={(option: any) =>
                                setFieldValue('offline_session_availability', option?.value)
                            }
                        />
                    )}
                </div>

                <div className="col-span-12 mt-20">
                    {isLoading ? (
                        <Skeleton height={150} className="w-full" />
                    ) : (
                        <GoogleMapFormField />
                    )}
                </div>
            </div>
        </>
    );
}
