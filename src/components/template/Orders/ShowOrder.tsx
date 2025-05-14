import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../components/molecules/BreadCrumbs';
import useFetch from '../../../hooks/UseFetch';
import Loading from '../../atoms/loading';
import LightBox from '../../molecules/LightBox/LightBox';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import imageError from '/assets/404.webp';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import showAlert from '../../atoms/ShowAlert';
import Cookies from 'js-cookie';
import { MdOutlineCancel, MdOutlineCheckCircle } from 'react-icons/md';
import { MRT_ColumnDef } from 'mantine-react-table';
import TableCompCustom from '../tantable/TableCutsom';
import { hasPermission } from '../../../helper/permissionHelpers';

const containerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '250px',
};

export default function ShowOrder() {
    const { t, i18n } = useTranslation();
    const baseURL = import.meta.env.VITE_BASE_URL;
    const user_token = Cookies.get('token');
    const token = user_token;

    const authorizationHeader = `Bearer ${token}`;

    const locale = i18n.language;

    const { id } = useParams();

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

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.orders.title'), to: '/orders/index' },
        { label: t('breadcrumb.orders.show') },
    ];

    const {
        data: showOrder,
        isError: showOrderError,
        isLoading: showOrderLoading,
        isSuccess: showOrderSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `orders/${id}`,
        queryKey: [`orders/${id}`],
    });

    // Update map center and marker position once the order data is fetched
    useEffect(() => {
        if (showOrderSuccess && showOrder?.data?.address?.lat && showOrder?.data?.address?.lng) {
            const newCenter = {
                lat: parseFloat(showOrder?.data?.address?.lat),
                lng: parseFloat(showOrder?.data?.address?.lng),
            };
            setMapCenter(newCenter);
            setMarkerPosition(newCenter);
        }
    }, [showOrderSuccess, showOrder]);

    const productColumns: MRT_ColumnDef[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        // {
        //     header: t('labels.image'),
        //     Cell: ({ renderedCellValue, row }: any) => (
        //         <div className="flex gap-5">
        //             {row.original.images && row.original?.images?.length > 0 ? (
        //                 //@ts-ignore
        //                 <LightBox
        //                     isProduct
        //                     getItems={row.original?.images?.map((image: any) => ({
        //                         src: image.media,
        //                     }))}
        //                 >
        //                     <img
        //                         src={row.original.images[0].media}
        //                         alt={'Product Image'}
        //                         className="rounded-full w-20 h-20 object-cover cursor-pointer"
        //                     />
        //                 </LightBox>
        //             ) : (
        //                 <span className="text-red-500 font-medium">{t('not_found')}</span>
        //             )}
        //         </div>
        //     ),
        //     accessorKey: 'image',
        // },

        {
            header: t('labels.product_name'),
            Cell: ({ row }: any) => {
                const product_name = row.original?.title || t('not_found');
                return <span>{product_name}</span>;
            },
            accessorKey: 'product_name',
        },

        {
            header: t('labels.quantity'),
            accessorKey: 'quantity',
            Cell: ({ row }: any) => {
                const quantity = row.original?.quantity;
                return <span>{quantity}</span>;
            },
        },

        {
            header: t('labels.price'),
            accessorKey: 'price',
            Cell: ({ row }: any) => {
                const price = row.original?.price;
                return <span>{price}</span>;
            },
        },

        ...(hasPermission('update-Product')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ row }: any) => (
                          <div className="flex gap-2 items-center ms-1">
                              <Link
                                  to={`/products/show/${row.original?.product_detail?.product_id}`}
                                  className="flex gap-5"
                              >
                                  <FaEye className="text-[19px] text-[#50cd89] ms-8" />
                              </Link>
                          </div>
                      ),
                      accessorKey: 'actions',
                  },
              ]
            : []),
    ];

    const handleChangeStatus = async (status?: string, id?: string) => {
        try {
            const res = await fetch(`${baseURL}/orders/${id}/${status}`, {
                method: 'POST',
                headers: {
                    Authorization: authorizationHeader,
                    'Accept-Language': i18n.language,
                },
            });

            // Check if response is not OK (e.g., 404 Not Found)
            if (!res.ok) {
                const errorData = await res.json(); // Parse error response
                throw new Error(errorData?.message || t('errorOccurred')); // Throw custom error
            }

            refetch();
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title: t('status_changed_successfully'),
            });
        } catch (err: any) {
            // Show error message to the user
            ShowAlertMixin({
                type: 15,
                icon: 'error',
                title: err?.response?.data?.message || err?.message,
            });
        }
    };

    const completeConfirmation = (newStatus?: string, id?: string) => {
        showAlert(t('accept_confirmation'), '', false, t('ok'), true, 'warning', () =>
            handleChangeStatus(newStatus, id)
        );
    };

    const inTheWayConfirmation = (newStatus?: string, id?: string) => {
        showAlert(t('in_the_way_confirmation'), '', false, t('ok'), true, 'warning', () =>
            handleChangeStatus(newStatus, id)
        );
    };

    const deliverConfirmation = (newStatus?: string, id?: string) => {
        showAlert(t('deliver_confirmation'), '', false, t('ok'), true, 'warning', () =>
            handleChangeStatus(newStatus, id)
        );
    };

    const cancelConfirmation = (newStatus?: string, id?: string) => {
        showAlert(t('reject_confirmation'), '', false, t('ok'), true, 'warning', () =>
            handleChangeStatus(newStatus, id)
        );
    };

    return (
        <>
            {(showOrderLoading && <Loading />) || (
                <>
                    <Breadcrumb items={breadcrumbItems} />
                    {showOrderSuccess && (
                        <>
                            <div className="grid grid-cols-12 gap-4 items-start">
                                <div className="client-section col-span-12 lg:col-span-3">
                                    {/* client Section */}
                                    <div className="bg-white shadow rounded-lg mb-5 p-5">
                                        <h5 className="text-xl font-bold text-primary mb-5">
                                            {t('labels.client_details')}
                                        </h5>

                                        <div className="flex flex-col items-center justify-center w-full p-0">
                                            <LightBox
                                                isShow
                                                getItems={[
                                                    {
                                                        src:
                                                            showOrder?.data?.client?.image ||
                                                            imageError,
                                                        title: showOrder?.data?.client?.name,
                                                    },
                                                ]}
                                            />

                                            <h2 className="text-xl font-semibold mb-2 mt-0">
                                                {showOrder?.data?.client?.name}
                                            </h2>
                                            <Link
                                                to={`/users/show/${showOrder?.data?.client?.id}`}
                                                className="border border-secondary p-2 my-1 rounded-lg"
                                            >
                                                <FaEye className="text-[19px] text-secondary" />
                                            </Link>
                                        </div>

                                        <div className="mx-auto space-y-4 mt-4">
                                            <p className="text-gray-600 mb-1">
                                                <strong>{t('labels.phone')}: </strong>
                                                {showOrder?.data?.client?.phone_complete_form}
                                            </p>
                                        </div>

                                        <div className="mx-auto space-y-4 mt-4">
                                            <p className="text-gray-600 mb-1">
                                                <strong>{t('labels.email')}: </strong>
                                                {showOrder?.data?.client?.email}
                                            </p>
                                        </div>

                                        <div className="mx-auto space-y-4 mt-4">
                                            <p className="text-gray-600 mb-1">
                                                <strong>{t('labels.gender')}: </strong>
                                                {t(`labels.${showOrder?.data?.client?.gender}`)}
                                            </p>
                                        </div>

                                        <div className="mx-auto space-y-4 mt-4">
                                            <p className="text-gray-600 mb-1">
                                                <strong>{t('labels.date_of_birth')}: </strong>
                                                {showOrder?.data?.client?.date_of_birth}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Orders Section */}
                                <div className="orders-section col-span-12  lg:col-span-9">
                                    <div className="col-span-12 bg-white shadow rounded-lg mb-5 p-5">
                                        <h5 className="text-xl font-bold text-primary mb-5">
                                            {t('labels.order_details')}
                                        </h5>

                                        <div className="grid grid-cols-12 gap-2 mb-5">
                                            <div className="col-span-4 mb-4">
                                                <p className="font-bold text-black">
                                                    {t('labels.order_no')}
                                                </p>
                                                <p className="text-success font-semibold">
                                                    {showOrder?.data?.order_no
                                                        ? `#${showOrder?.data?.order_no}`
                                                        : t('not_found')}
                                                </p>
                                            </div>

                                            <div className="col-span-4 mb-4">
                                                <p className="font-bold text-black">
                                                    {t('labels.coupon_value')}
                                                </p>

                                                <p className="font-semibold text-gray-500">
                                                    {showOrder?.data?.coupon_value}
                                                </p>
                                            </div>

                                            <div className="col-span-4 mb-4">
                                                <p className="font-bold text-black">
                                                    {t('labels.discount_value')}
                                                </p>

                                                <p className="font-semibold text-gray-500">
                                                    {showOrder?.data?.discount_value ||
                                                        t('not_found')}
                                                </p>
                                            </div>

                                            <div className="col-span-4 mb-4">
                                                <p className="font-bold text-black">
                                                    {t('labels.payment_type')}
                                                </p>

                                                <p className="font-semibold text-gray-500">
                                                    {showOrder?.data?.payment_type
                                                        ? t(
                                                              `labels.${showOrder?.data?.payment_type}`
                                                          )
                                                        : t('not_found')}
                                                </p>
                                            </div>

                                            <div className="col-span-4 mb-4">
                                                <p className="font-bold text-black">
                                                    {t('labels.shipping_value')}
                                                </p>

                                                <p className="font-semibold text-gray-500">
                                                    {showOrder?.data?.shipping_value}
                                                </p>
                                            </div>

                                            <div className="col-span-4 mb-4">
                                                <p className="font-bold text-black">
                                                    {t('labels.sub_total')}
                                                </p>

                                                <p className="font-semibold text-gray-500">
                                                    {showOrder?.data?.sub_total}
                                                </p>
                                            </div>

                                            <div className="col-span-4 mb-4">
                                                <p className="font-bold text-black">
                                                    {t('labels.vat_value')}
                                                </p>

                                                <p className="font-semibold text-gray-500">
                                                    {showOrder?.data?.vat_value}
                                                </p>
                                            </div>

                                            <div className="col-span-4 mb-4">
                                                <p className="font-bold text-black">
                                                    {t('labels.total')}
                                                </p>

                                                <p className="font-semibold text-gray-500">
                                                    {showOrder?.data?.total}
                                                </p>
                                            </div>

                                            <div className="col-span-4 mb-4">
                                                <p className="font-bold text-black">
                                                    {t('labels.created_at')}
                                                </p>

                                                <p className="font-semibold text-gray-500">
                                                    {showOrder?.data?.created_at || t('not_found')}
                                                </p>
                                            </div>

                                            <div className="col-span-4 mb-4">
                                                <p className="font-bold text-black mb-4">
                                                    {t('labels.is_payment')}
                                                </p>

                                                <span
                                                    className={`${
                                                        showOrder?.data?.is_active
                                                            ? 'active'
                                                            : 'inactive'
                                                    } statuses font-medium p-2`}
                                                >
                                                    {showOrder?.data?.is_active
                                                        ? t('yes')
                                                        : t('no')}
                                                </span>
                                            </div>

                                            <div className="col-span-4 mb-4">
                                                <p className="font-bold text-black mb-4">
                                                    {t('labels.status')}
                                                </p>

                                                <span
                                                    className={`${showOrder?.data?.status} statuses font-medium p-2`}
                                                >
                                                    {showOrder?.data?.status
                                                        ? t(`status.${showOrder?.data?.status}`)
                                                        : t('not_found')}
                                                </span>

                                                {showOrder?.data?.status === 'pending' ? (
                                                    <div className="flex flex-wrap justify-start items-center mt-3 gap-2">
                                                        <div
                                                            className="flex cursor-pointer gap-1"
                                                            onClick={() => {
                                                                completeConfirmation(
                                                                    'accept',
                                                                    showOrder?.data?.id
                                                                );
                                                            }}
                                                        >
                                                            <MdOutlineCheckCircle className="text-[22px] text-[#1da3a3]" />
                                                            <span className="font-bold text-[#1da3a3]">
                                                                {t('buttons.accept')}
                                                            </span>
                                                        </div>

                                                        <div
                                                            className="flex cursor-pointer gap-1"
                                                            onClick={() => {
                                                                cancelConfirmation(
                                                                    'reject',
                                                                    showOrder?.data?.id
                                                                );
                                                            }}
                                                        >
                                                            <MdOutlineCancel className="text-[22px] text-red-500 " />
                                                            <span className="font-bold text-red-500">
                                                                {t('buttons.cancel')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {showOrder?.data?.status === 'accepted' ? (
                                                            <div className="flex flex-wrap justify-start items-center mt-3 gap-2">
                                                                <div
                                                                    className="flex cursor-pointer gap-1"
                                                                    onClick={() => {
                                                                        inTheWayConfirmation(
                                                                            'in-the-way',
                                                                            showOrder?.data?.id
                                                                        );
                                                                    }}
                                                                >
                                                                    <MdOutlineCheckCircle className="text-[22px] text-[#1268bf]" />
                                                                    <span className="font-bold text-[#1268bf]">
                                                                        {t('buttons.in_the_way')}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {showOrder?.data?.status ===
                                                                    'in_the_way' && (
                                                                    <div className="flex flex-wrap justify-start items-center mt-3 gap-2">
                                                                        <div
                                                                            className="flex cursor-pointer gap-1"
                                                                            onClick={() => {
                                                                                deliverConfirmation(
                                                                                    'delivered',
                                                                                    showOrder?.data
                                                                                        ?.id
                                                                                );
                                                                            }}
                                                                        >
                                                                            <MdOutlineCheckCircle className="text-[22px] text-success" />
                                                                            <span className="font-bold text-success">
                                                                                {t(
                                                                                    'buttons.deliver'
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <hr />
                                        <h5 className="text-xl font-bold text-primary my-5">
                                            {t('labels.location')}
                                        </h5>
                                        <div className="grid grid-cols-12 gap-2 ">
                                            <div className="col-span-4 mb-4">
                                                <p className="font-bold text-black">
                                                    {t('labels.country')}
                                                </p>
                                                <p className="font-semibold text-gray-500">
                                                    {showOrder?.data?.address?.country?.name ||
                                                        t('not_found')}
                                                </p>
                                            </div>
                                            <div className="col-span-4 mb-4">
                                                <p className="font-bold text-black">
                                                    {t('labels.state')}
                                                </p>
                                                <p className="font-semibold text-gray-500">
                                                    {showOrder?.data?.address?.state?.name ||
                                                        t('not_found')}
                                                </p>
                                            </div>
                                            <div className="col-span-4 mb-4">
                                                <p className="font-bold text-black">
                                                    {t('labels.city')}
                                                </p>
                                                <p className="font-semibold text-gray-500">
                                                    {showOrder?.data?.address?.city?.name ||
                                                        t('not_found')}
                                                </p>
                                            </div>

                                            <div className="col-span-4 mb-4">
                                                <p className="font-bold text-black">
                                                    {t('labels.postal_code')}
                                                </p>
                                                <p className="font-semibold text-gray-500">
                                                    {showOrder?.data?.address?.zip_code ||
                                                        t('not_found')}
                                                </p>
                                            </div>
                                            <div className="col-span-4 mb-4">
                                                <p className="font-bold text-black">
                                                    {t('labels.street')}
                                                </p>
                                                <p className="font-semibold text-gray-500">
                                                    {showOrder?.data?.address?.street_address ||
                                                        t('not_found')}
                                                </p>
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

                                    <div className="col-span-12 lg:col-span-9 bg-white shadow rounded-lg p-5 mb-5">
                                        <h5 className="text-xl font-bold text-primary mb-3">
                                            {t('labels.products')}
                                        </h5>

                                        <TableCompCustom
                                            showOnly={true}
                                            columns={productColumns}
                                            data={showOrder?.data?.products || []}
                                            isLoading={showOrderLoading}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    );
}
