import { Skeleton } from '@mantine/core';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DateInput from '../../../components/atoms/DateInput';
import { Label } from '../../atoms';
import { BaseInputField } from '../../atoms/BaseInputField';
import TimeInp from '../../atoms/inputs/TimeInp';
import NewUploadImgRepeaterAttachment from '../../atoms/NewUploadImgRepeaterAttachment';

export default function MainDataSliders({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();
    const { setFieldValue, values } = useFormikContext<{ [key: string]: any }>();
    const id = useParams();

    const date = new Date();

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
                                    model="Slider"
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
                        <Skeleton height={100} className="w-full" />
                    ) : (
                        <DateInput
                            minDateValue={id && id.id ? '' : date}
                            label={t('labels.start_date')}
                            name="start_date"
                            placeholder={t('enter') + ' ' + t('labels.start_date')}
                            defaultValue={values.start_date}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={100} className="w-full" />
                    ) : (
                        <DateInput
                            minDateValue={values.start_date}
                            label={t('labels.end_date')}
                            name="end_date"
                            placeholder={t('enter') + ' ' + t('labels.end_date')}
                            defaultValue={values.end_date}
                            disabled={!values.start_date}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <TimeInp
                            label={t('labels.start_time')}
                            name="start_time"
                            defaultValue={values.start_time}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <TimeInp
                            label={t('labels.end_time')}
                            name="end_time"
                            defaultValue={values.end_time}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.external_link')}
                            name="external_link"
                            id="external_link"
                            type="url"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.external_link')}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
