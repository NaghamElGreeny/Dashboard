import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../components/molecules/BreadCrumbs';
import useFetch from '../../../hooks/UseFetch';
import Loading from '../../atoms/loading';
import { Label } from '../../atoms';
import LightBox from '../../molecules/LightBox/LightBox';
import imageError from '/assets/images/logo.png';
import VideoLightBox from '../../molecules/VideoLightBox/VideoLightBox';

export default function ShowCourse() {
    const { t } = useTranslation();
    const { id } = useParams();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.courses.title'), to: '/courses/index' },
        { label: t('breadcrumb.courses.show') },
    ];

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `course/${id}`,
        queryKey: [`course/${id}`],
    });

    return (
        <>
            {(showDataLoading && <Loading />) || (
                <>
                    <Breadcrumb items={breadcrumbItems} />
                    {showDataSuccess && (
                        <>
                            <div className="details-section w-full bg-white shadow rounded-lg p-5">
                                <div className="grid grid-cols-12 gap-2 mb-5">
                                    <div className="col-span-12 flex justify-center mb-10 items-center">
                                        <div>
                                            <Label htmlFor="image" className="mb-1">
                                                {t('labels.image')}
                                            </Label>
                                            <LightBox
                                                isProduct
                                                getItems={[
                                                    {
                                                        src: showData?.data?.image || imageError,
                                                        title: showData?.data?.title,
                                                    },
                                                ]}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="size_guide" className="mb-1">
                                                {t('labels.videos')}
                                            </Label>

                                            {showData?.data?.videos &&
                                            showData?.data?.videos.length > 0 ? (
                                                <VideoLightBox
                                                    videos={showData?.data?.videos} // Pass all videos to the lightbox
                                                    startIndex={0} // Ensure it starts with the first video
                                                    showFirstOnly={true} // prop to display only the first video in the table
                                                />
                                            ) : (
                                                <span>{t('not_found')}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-2">
                                            {t('labels.title')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.title || t('not_found')}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-2">
                                            {t('labels.instructor_name')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.instructor_name || t('not_found')}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-2">
                                            {t('labels.course_category')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.course_category_data?.name ||
                                                t('not_found')}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-2">
                                            {t('labels.videos_count')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.videos_count || 0}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-2">
                                            {t('labels.client_registered_count')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.client_registered_count || 0}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-2">
                                            {t('labels.duration')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.duration || 0}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-2">
                                            {t('labels.price')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.price || 0}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-2">
                                            {t('labels.type')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {t(`labels.${showData?.data?.type}`) || t('not_found')}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-4">
                                            {t('labels.status')}
                                        </p>

                                        <span
                                            className={`${
                                                showData?.data?.is_active ? 'active' : 'inactive'
                                            } statuses`}
                                        >
                                            {showData?.data?.is_active
                                                ? t('labels.active')
                                                : t('labels.inactive')}
                                        </span>
                                    </div>
                                </div>
                                <hr />
                                <div className="col-span-12 my-4">
                                    <p className="font-bold text-black mb-2">
                                        {t('labels.description')}
                                    </p>

                                    <p className="font-semibold text-gray-500">
                                        {showData?.data?.desc || t('not_found')}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    );
}
