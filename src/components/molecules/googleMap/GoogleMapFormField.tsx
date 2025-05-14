//@ts-nocheck

import { useEffect, useState } from 'react';
import { useField, useFormikContext } from 'formik';
import GoogleMap from './GoogleMap';

import { useTranslation } from 'react-i18next';
import { Button } from '@mantine/core';

const GoogleMapFormField = () => {
    const { t } = useTranslation();
    const { setFieldValue, errors, values } = useFormikContext();
    const [loadingUserPosition, setLoadingUserPosition] = useState(false);

    // استخدام useField لكل من خطوط العرض والطول للوصول إلى الخطأ والقيمة
    const [, latMeta, latHelpers] = useField('lat');
    const [, lngMeta, lngHelpers] = useField('lng');

    const handleGetUserLocation = () => {
        setLoadingUserPosition(true);
        try {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude: lat, longitude: lng } = position.coords;
                        setFieldValue('lat', lat);
                        setFieldValue('lng', lng);
                        setLoadingUserPosition(false);
                    },
                    (error) => {
                        // تحديد موقع افتراضي في حال فشل الحصول على الموقع
                        setFieldValue('lat', 30.0444196);
                        setFieldValue('lng', 31.2357116);
                        let errorMsg = '';
                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                errorMsg = 'User denied the request for geolocation.';
                                break;
                            case error.POSITION_UNAVAILABLE:
                                errorMsg = 'Location information is unavailable.';
                                break;
                            case error.TIMEOUT:
                                errorMsg = 'The request to get user location timed out.';
                                break;
                            default:
                                errorMsg = 'An unknown error occurred.';
                        }
                        setLoadingUserPosition(false);
                        console.error(errorMsg); // استخدم طريقتك المفضلة لعرض الأخطاء
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        } catch (error) {
            console.error(JSON.stringify(error));
        }
    };

    useEffect(() => {
        handleGetUserLocation();
    }, []);

    return (
        <div>
            <div className="h-96 rounded-2xl overflow-hidden bg-[#F5F5F5]">
                {values.lat && values.lng ? (
                    <GoogleMap
                        defaultMarkerPostion={{
                            lat: Number(values.lat),
                            lng: Number(values.lng),
                        }}
                        onMarkerPositionChange={(position) => {
                            setFieldValue('lat', position.lat);
                            setFieldValue('lng', position.lng);
                        }}
                    />
                ) : (
                    <div className="w-full h-full grid place-content-center gap-5 p-8">
                        <p className="text-center">{t('activate_location')}</p>
                        <Button
                            className="rounded-full pb-1"
                            type="button"
                            loading={loadingUserPosition}
                            onClick={handleGetUserLocation}
                        >
                            {t('set_location')}
                        </Button>
                    </div>
                )}
            </div>
            {(latMeta.error || lngMeta.error) && (
                <p className="text-red-500">{t('this_field_is_required')}</p>
            )}
        </div>
    );
};

export default GoogleMapFormField;
