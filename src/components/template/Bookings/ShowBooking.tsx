import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../components/molecules/BreadCrumbs';
import useFetch from '../../../hooks/UseFetch';
import Loading from '../../atoms/loading';
import { useCallback, useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { hasPermission } from '../../../helper/permissionHelpers';
import { MdOutlineCancel } from 'react-icons/md';
import { useMutate } from '../../../hooks/UseMutate';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import showAlert from '../../atoms/ShowAlert';

const containerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '250px',
};

export default function ShowBooking() {
    const { t } = useTranslation();
    const { id } = useParams();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.bookings.title'), to: '/bookings/index' },
        { label: t('breadcrumb.bookings.show') },
    ];

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `booking/${id}`,
        queryKey: [`booking/${id}`],
    });

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyDRymdCLWxCwLHFnwv36iieKAMjiwk8sdc',
        libraries: ['places'],
    });

    const [map, setMap] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: 21.420001868436646, lng: 39.8107274369873 }); // Default center
    const [markerPosition, setMarkerPosition] = useState({
        lat: 21.420001868436646,
        lng: 39.8107274369873,
    }); // Default marker position

    const onLoad = useCallback(function callback(map: any) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map: any) {
        setMap(null);
    }, []);

    // Update map center and marker position once the order data is fetched
    useEffect(() => {
        if (
            showDataSuccess &&
            showData?.data?.address_data?.lat &&
            showData?.data?.address_data?.lng
        ) {
            const newCenter = {
                lat: parseFloat(showData?.data?.address_data?.lat),
                lng: parseFloat(showData?.data?.address_data?.lng),
            };
            setMapCenter(newCenter);
            setMarkerPosition(newCenter);
        }
    }, [showDataSuccess, showData]);

    const { mutate: cancelMutate } = useMutate({
        mutationKey: [`booking/cancellation/${id}`],
        endpoint: `booking/cancellation/${id}`,
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title: t('status_changed_successfully'),
            });

            refetch();
        },
        onError: (err: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'error',
                title: err?.response?.data?.message,
            });
        },
        formData: true,
    });

    const cancelConfirmation = () => {
        showAlert(t('cancel_confirmation'), '', false, t('ok'), true, 'warning', () =>
            cancelMutate({})
        );
    };

    return (
        <>
            {(showDataLoading && <Loading />) || (
                <>
                    <Breadcrumb items={breadcrumbItems} />
                    {showDataSuccess && (
                        <>
                            <div className="details-section w-full bg-white shadow rounded-lg p-5">
                                <div className="grid grid-cols-12 gap-2 mb-5">
                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-2">
                                            {t('labels.service')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.service_data?.service ||
                                                t('not_found')}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-2">
                                            {t('labels.service_price')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.service_price || t('not_found')}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-2">
                                            {t('labels.provider')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.provider_data?.full_name ||
                                                t('not_found')}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-2">
                                            {t('labels.client')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.client_data?.full_name ||
                                                t('not_found')}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-2">
                                            {t('labels.booking_date')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.date || t('not_found')}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-2">
                                            {t('labels.booking_time')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.time || t('not_found')}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-2">
                                            {t('labels.created_at')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.created_at || t('not_found')}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-2">
                                            {t('labels.additional_fees')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.additional_fees || 0}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-2">
                                            {t('labels.discount')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.discount || 0}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-2">
                                            {t('labels.total_price')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.total_price || 0}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-2">
                                            {t('labels.client_check_in_at')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.client_check_in_at || t('not_found')}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-2">
                                            {t('labels.client_check_out_at')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.client_check_out_at || t('not_found')}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-2">
                                            {t('labels.provider_check_in_at')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.provider_check_in_at || t('not_found')}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-2">
                                            {t('labels.provider_check_out_at')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.provider_check_out_at ||
                                                t('not_found')}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-2">
                                            {t('labels.payment_method')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {t(`labels.${showData?.data?.payment_method}`) ||
                                                t('not_found')}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-4">
                                            {t('labels.is_rescheduled')}
                                        </p>

                                        <span
                                            className={`${
                                                showData?.data?.is_rescheduled
                                                    ? 'active'
                                                    : 'inactive'
                                            } statuses`}
                                        >
                                            {showData?.data?.is_rescheduled ? t('yes') : t('no')}
                                        </span>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-4">
                                        <p className="font-bold text-black mb-4">
                                            {t('labels.status')}
                                        </p>

                                        <span className={`${showData.data?.status} statuses `}>
                                            {showData?.data?.status_translated}
                                        </span>

                                        {showData?.data?.status === 'active' &&
                                            (hasPermission('booking.cancelBooking') ? (
                                                <div
                                                    className="flex cursor-pointer gap-1 mt-3"
                                                    onClick={() => {
                                                        cancelConfirmation();
                                                    }}
                                                >
                                                    <MdOutlineCancel className="text-[22px] text-red-500 ms-8" />
                                                    <span className="font-bold text-red-500">
                                                        {t('buttons.cancel')}
                                                    </span>
                                                </div>
                                            ) : (
                                                ''
                                            ))}
                                    </div>
                                </div>

                                {showData.data?.status === 'cancelled' && (
                                    <>
                                        <hr />
                                        <div className="grid grid-cols-12 gap-2 my-5">
                                            <div className="col-span-12 md:col-span-6 mb-4">
                                                <p className="font-bold text-black mb-2">
                                                    {t('labels.cancelled_by')}
                                                </p>

                                                <p className="font-semibold text-gray-500">
                                                    {showData?.data?.cancelled_by || t('not_found')}
                                                </p>
                                            </div>

                                            <div className="col-span-12 md:col-span-6 mb-4">
                                                <p className="font-bold text-black mb-2">
                                                    {t('labels.cancelled_at')}
                                                </p>

                                                <p className="font-semibold text-gray-500">
                                                    {showData?.data?.cancelled_at || t('not_found')}
                                                </p>
                                            </div>
                                            <div className="col-span-12">
                                                <p className="font-bold text-black mb-2">
                                                    {t('labels.cancel_reason')}
                                                </p>

                                                <div
                                                    className="font-semibold text-gray-500"
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            showData?.data?.cancel_reason ||
                                                            t('not_found'),
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {showData.data?.address_data && (
                                    <>
                                        <hr />
                                        <div className="grid grid-cols-12 gap-2 my-5">
                                            <div className="col-span-12">
                                                <h2 className="text-xl font-bold text-primary mb-2">
                                                    {t('labels.address_data')}
                                                </h2>
                                            </div>
                                            <div className="col-span-12 md:col-span-6 mb-4">
                                                <p className="font-bold text-black mb-2">
                                                    {t('labels.appartment_number')}
                                                </p>

                                                <p className="font-semibold text-gray-500">
                                                    {showData?.data?.address_data
                                                        ?.appartment_number || t('not_found')}
                                                </p>
                                            </div>

                                            <div className="col-span-12 md:col-span-6 mb-4">
                                                <p className="font-bold text-black mb-2">
                                                    {t('labels.floor')}
                                                </p>

                                                <p className="font-semibold text-gray-500">
                                                    {showData?.data?.address_data?.floor ||
                                                        t('not_found')}
                                                </p>
                                            </div>
                                            <div className="col-span-12">
                                                <p className="font-bold text-black mb-2">
                                                    {t('labels.address')}
                                                </p>

                                                <div className="font-semibold text-gray-500">
                                                    {showData?.data?.address_data?.address ||
                                                        t('not_found')}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-12 lg:col-span-9 bg-white shadow rounded-lg p-5 mb-5">
                                            <GoogleMap
                                                mapContainerStyle={containerStyle}
                                                center={mapCenter} // Use dynamic center
                                                zoom={15}
                                                onLoad={onLoad}
                                                onUnmount={onUnmount}
                                            >
                                                {/* Marker at the order location */}
                                                <Marker position={markerPosition} />
                                            </GoogleMap>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    );
}
