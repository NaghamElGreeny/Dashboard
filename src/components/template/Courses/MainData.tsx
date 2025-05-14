import { Skeleton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';
import { Label } from '../../atoms';
import NewUploadImgRepeaterAttachment from '../../atoms/NewUploadImgRepeaterAttachment';
import GeneralSelect from '../../molecules/selects/GeneralSelect';
import { useFormikContext } from 'formik';
import GeneralStaticSelect from '../../molecules/selects/GeneralStaticSelect';
import MultipleAttachmentsUpload from '../../atoms/MultipleAttachmentsUpload';

export default function CourseMainData({
    isLoading,
    refetch,
}: {
    isLoading?: boolean;
    refetch?: () => void;
}) {
    const { t } = useTranslation();
    const { setFieldValue, values } = useFormikContext<{ [key: string]: any }>();

    const typesList = [
        {
            id: 0,
            value: 'paid',
            label: t('labels.paid'),
        },
        {
            id: 1,
            value: 'free',
            label: t('labels.free'),
        },
    ];

    return (
        <>
            <div className="grid grid-cols-12 gap-2">
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-2 col-span-12 mb-4">
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
                                    model="Course"
                                />
                            </>
                        )}
                    </div>
                    <div className="flex flex-col items-center justify-center w-full my-4">
                        {isLoading ? (
                            <Skeleton height={100} circle />
                        ) : (
                            <>
                                <MultipleAttachmentsUpload
                                    name="videos"
                                    label={t('labels.videos')}
                                    model="Course"
                                    type="video"
                                    acceptFiles="video/mp4,video/mkv"
                                    refetch={refetch}
                                    initialValues={
                                        (values?.videos &&
                                            values?.videos
                                                ?.filter(Boolean)
                                                ?.map((video: any) => {
                                                    if (!video?.id || !video?.media) {
                                                        return null;
                                                    }
                                                    return {
                                                        id: video.id,
                                                        url: video.media,
                                                    };
                                                })
                                                .filter(Boolean)) ||
                                        []
                                    }
                                    onChange={(videoIds) => {
                                        setFieldValue('videos', videoIds);
                                    }}
                                />
                            </>
                        )}
                    </div>
                </div> */}

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
                                    model="Course"
                                />
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2 col-span-12 mb-4">
                    <div className="flex flex-col items-center justify-center w-full my-4">
                        <MultipleAttachmentsUpload
                            name="videos"
                            label={t('labels.videos')}
                            model="Course"
                            type="video"
                            acceptFiles="video/mp4,video/mkv"
                            refetch={refetch}
                            initialValues={
                                (values?.videos &&
                                    values?.videos
                                        ?.filter(Boolean)
                                        ?.map((video: any) => {
                                            if (!video?.id || !video?.media) {
                                                return null;
                                            }
                                            return {
                                                id: video.id,
                                                url: video.media,
                                            };
                                        })
                                        .filter(Boolean)) ||
                                []
                            }
                            onChange={(videoIds) => {
                                setFieldValue('videos', videoIds);
                            }}
                        />
                    </div>
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
                            label={t('labels.instructor_name') + t('inArabic')}
                            name="ar_instructor_name"
                            id="ar_instructor_name"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.instructor_name')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.instructor_name') + t('inEnglish')}
                            name="en_instructor_name"
                            id="en_instructor_name"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.instructor_name')}
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
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.description')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralSelect
                            isGeneral={true}
                            name="course_category_id"
                            label={t('labels.course_category')}
                            placeholder={t('select') + ' ' + t('labels.course_category')}
                            apiName="course-category/list-without-pag"
                            onChange={(option: any) => setFieldValue('course_category_id', option)}
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

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.duration')}
                            name="duration"
                            id="duration"
                            type="number"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.duration')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.price')}
                            name="price"
                            id="price"
                            type="number"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.price')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.videos_count')}
                            name="videos_count"
                            id="videos_count"
                            type="number"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.videos_count')}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
