import { MRT_ColumnDef } from 'mantine-react-table';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { BiSolidReport } from 'react-icons/bi';
import { FaEye, FaUniversity } from 'react-icons/fa';
import { MdEmail, MdOutlineEmojiFlags, MdOutlineVerifiedUser, MdPhone } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../components/molecules/BreadCrumbs';
import { hasPermission } from '../../../helper/permissionHelpers';
import useFetch from '../../../hooks/UseFetch';
import { useIsRTL } from '../../../hooks/useIsRTL';
import { useMutate } from '../../../hooks/UseMutate';
import Loading from '../../atoms/loading';
import showAlert from '../../atoms/ShowAlert';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import CardItem from '../../molecules/CardItem';
import LightBox from '../../molecules/LightBox/LightBox';
import Rating from '../../molecules/Rating/Rating';
import Switcher from '../../molecules/Switcher';
import TableCompCustom from '../tantable/TableCutsom';
import defaultAvatar from '/assets/images/avatar.jpg';

export default function ShowProvider() {
    const { t } = useTranslation();

    const { id } = useParams();

    const rtl = useIsRTL();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.providers.title'), to: '/providers/index' },
        { label: t('breadcrumb.providers.show') },
    ];

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `provider/${id}`,
        queryKey: [`provider/${id}`],
    });

    // Ensure data exists before accessing properties
    const providerData = showData?.data || {};

    const { mutate: ChangeActiveMutate } = useMutate({
        mutationKey: [`provider/toggle-active/${id}`],
        endpoint: `provider/toggle-active/${id}`,
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

    const changeActive = (newStatus: any) => {
        showAlert(t('toggle_status_confirmation'), '', false, t('ok'), true, 'warning', () =>
            ChangeActiveMutate({ is_active: newStatus })
        );
    };

    const { mutate: ChangeBanMutate } = useMutate({
        mutationKey: [`provider/toggle-ban/${id}`],
        endpoint: `provider/toggle-ban/${id}`,
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

    const changeBan = (newStatus: any) => {
        showAlert(t('toggle_status_confirmation'), '', false, t('ok'), true, 'warning', () =>
            ChangeBanMutate({ is_banned: newStatus })
        );
    };

    const bookingColumns: MRT_ColumnDef[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.service'),
            Cell: ({ row }: any) => {
                const service = row.original?.service_data?.service || '---';
                return <span>{service}</span>;
            },
            accessorKey: 'service',
        },

        {
            header: t('labels.total_price'),
            Cell: ({ row }: any) => {
                const total_price = row.original?.total_price || '---';
                return <span>{total_price}</span>;
            },
            accessorKey: 'total_price',
        },

        {
            header: t('labels.booking_date'),
            Cell: ({ row }: any) => {
                const date = row.original?.date;
                return <span>{date || '---'}</span>;
            },
            accessorKey: 'booking_date',
        },

        {
            header: t('labels.booking_time'),
            Cell: ({ row }: any) => {
                const time = row.original?.time;
                return <span>{time || '---'}</span>;
            },
            accessorKey: 'booking_time',
        },

        {
            accessorKey: 'is_rescheduled',
            header: t('labels.is_rescheduled'),
            Cell: ({ row }: any) => {
                const is_rescheduled = row.original?.is_rescheduled ? t('yes') : t('no');
                return (
                    <>
                        <span
                            className={`${
                                row.original?.is_rescheduled ? 'active' : 'inactive'
                            } statuses `}
                        >
                            {is_rescheduled}
                        </span>
                    </>
                );
            },
        },

        {
            accessorKey: 'status',
            header: t('labels.status'),
            Cell: ({ row }: any) => {
                const status_translated = row.original?.status_translated;
                return (
                    <>
                        <span className={`${row.original?.status} statuses `}>
                            {row.original?.status ? status_translated : '---'}
                        </span>
                    </>
                );
            },
        },

        {
            header: t('labels.created_at'),
            Cell: ({ row }: any) => {
                const created_at = row.original?.created_at || '---';
                return <span>{created_at || '---'}</span>;
            },
            accessorKey: 'created_at',
        },

        ...(hasPermission('booking.show')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ row }: any) => (
                          <div className="flex gap-2 items-center ms-1">
                              <Link to={`/bookings/show/${row.original.id}`} className="flex gap-5">
                                  <FaEye className="text-[19px] text-[#50cd89] ms-8" />
                              </Link>
                          </div>
                      ),
                      accessorKey: 'actions',
                  },
              ]
            : []),
    ];

    const transactionsColumns: MRT_ColumnDef[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.amountMoney'),
            accessorKey: 'amount',
            Cell: ({ row }: any) => {
                const amount = row.original.amount || t('not_found');
                return <span>{amount}</span>;
            },
        },

        {
            header: t('labels.type'),
            accessorKey: 'type',
            Cell: ({ row }: any) => {
                const type = row.original.type_trans || t('not_found');
                return <span>{type}</span>;
            },
        },

        {
            header: t('labels.created_at'),
            accessorKey: 'date',
            Cell: ({ row }: any) => {
                const created_at =
                    moment(row.original.created_at).format('YYYY-MM-DD') || t('not_found');
                return <span>{created_at}</span>;
            },
        },
    ];

    return (
        <>
            {(showDataLoading && <Loading />) || (
                <>
                    <Breadcrumb items={breadcrumbItems} />
                    {showDataSuccess && (
                        <div className="flex flex-col items-center bg-white dark:bg-black shadow-lg rounded-lg p-6 w-full">
                            <LightBox
                                isShow
                                getItems={[
                                    {
                                        src: providerData?.image || defaultAvatar,
                                        title: providerData?.full_name,
                                    },
                                ]}
                            />
                            <h2 className="text-2xl font-bold text-primary mt-4">
                                {providerData?.full_name || 'User'}
                            </h2>
                            <Rating value={providerData?.rate} onChange={providerData?.rate} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 w-full">
                                {/* email */}
                                <CardItem
                                    icon={<MdEmail className="w-8 h-8" />}
                                    label={t('labels.email')}
                                    value={providerData?.email || t('not_found')}
                                />

                                {/* Phone Number */}
                                <CardItem
                                    icon={<MdPhone className="w-8 h-8" />}
                                    label={t('labels.phone')}
                                    value={
                                        <>
                                            {rtl ? (
                                                <span>
                                                    {providerData?.phone} {providerData?.phone_code}
                                                </span>
                                            ) : (
                                                <span>
                                                    {providerData?.phone_code} {providerData?.phone}
                                                </span>
                                            )}
                                        </>
                                    }
                                />

                                {/* bookings_count */}
                                <CardItem
                                    icon={<MdOutlineEmojiFlags className="w-8 h-8" />}
                                    label={t('labels.bookings_count')}
                                    value={`${providerData?.bookings_count || 0}`}
                                />

                                {/* category_data */}
                                <CardItem
                                    icon={<MdOutlineEmojiFlags className="w-8 h-8" />}
                                    label={t('labels.category')}
                                    value={`${
                                        providerData?.category_data?.title || t('not_found')
                                    }`}
                                />

                                {/* subcategory_data */}
                                <CardItem
                                    icon={<MdOutlineEmojiFlags className="w-8 h-8" />}
                                    label={t('labels.sub_category')}
                                    value={`${
                                        providerData?.subcategory_data?.title || t('not_found')
                                    }`}
                                />

                                {/* license_number */}
                                <CardItem
                                    icon={<MdOutlineEmojiFlags className="w-8 h-8" />}
                                    label={t('labels.license_number')}
                                    value={`${providerData?.license_number || t('not_found')}`}
                                />

                                {/* medical_associations */}
                                <CardItem
                                    icon={<MdOutlineEmojiFlags className="w-8 h-8" />}
                                    label={t('labels.medical_associations')}
                                    value={`${
                                        providerData?.medical_associations || t('not_found')
                                    }`}
                                />

                                {/* scientific_experience */}
                                <CardItem
                                    icon={<MdOutlineEmojiFlags className="w-8 h-8" />}
                                    label={t('labels.scientific_experience')}
                                    value={`${
                                        providerData?.scientific_experience || t('not_found')
                                    }`}
                                />

                                {/* university */}
                                <CardItem
                                    icon={<FaUniversity className="w-8 h-8" />}
                                    label={t('labels.university')}
                                    value={`${providerData?.university || t('not_found')}`}
                                />

                                {/* work_experience */}
                                <CardItem
                                    icon={<MdOutlineEmojiFlags className="w-8 h-8" />}
                                    label={t('labels.work_experience')}
                                    value={`${providerData?.work_experience || 0}`}
                                />

                                {/* bookings_count */}
                                <CardItem
                                    icon={<BiSolidReport className="w-8 h-8" />}
                                    label={t('labels.bookings_count')}
                                    value={providerData?.bookings_count || 0}
                                />

                                {/* daily_bookings_count */}
                                <CardItem
                                    icon={<BiSolidReport className="w-8 h-8" />}
                                    label={t('labels.daily_bookings_count')}
                                    value={providerData?.daily_bookings_count || 0}
                                />

                                {/* monthly_bookings_count */}
                                <CardItem
                                    icon={<BiSolidReport className="w-8 h-8" />}
                                    label={t('labels.monthly_bookings_count')}
                                    value={providerData?.monthly_bookings_count || 0}
                                />

                                {/* status */}
                                <CardItem
                                    hasToggle
                                    icon={<MdOutlineVerifiedUser className="w-8 h-8" />}
                                    label={t('labels.status')}
                                    value={
                                        <>
                                            {hasPermission('provider.toggle')
                                                ? [
                                                      <Switcher
                                                          label={
                                                              providerData?.is_active
                                                                  ? t('labels.active')
                                                                  : t('labels.inactive')
                                                          }
                                                          checked={providerData?.is_active}
                                                          onChange={() => {
                                                              const newStatus =
                                                                  providerData?.is_active === true
                                                                      ? 0
                                                                      : 1;
                                                              changeActive(newStatus);
                                                          }}
                                                      />,
                                                  ]
                                                : [
                                                      <>
                                                          <span
                                                              className={`${
                                                                  providerData?.is_active
                                                                      ? 'active'
                                                                      : 'inactive'
                                                              } statuses`}
                                                          >
                                                              {providerData?.is_active
                                                                  ? t('labels.active')
                                                                  : t('labels.inactive')}
                                                          </span>
                                                      </>,
                                                  ]}
                                        </>
                                    }
                                />

                                {/* is_banned */}
                                <CardItem
                                    hasToggle
                                    icon={<MdOutlineVerifiedUser className="w-8 h-8" />}
                                    label={t('labels.is_ban')}
                                    value={
                                        <>
                                            {hasPermission('provider.toggleBan')
                                                ? [
                                                      <Switcher
                                                          label={
                                                              providerData?.is_banned
                                                                  ? t('labels.ban')
                                                                  : t('labels.un_ban')
                                                          }
                                                          checked={!providerData?.is_banned}
                                                          onChange={() => {
                                                              const newStatus =
                                                                  providerData?.is_banned === true
                                                                      ? 0
                                                                      : 1;
                                                              changeBan(newStatus);
                                                          }}
                                                      />,
                                                  ]
                                                : [
                                                      <>
                                                          <span
                                                              className={`${
                                                                  !providerData?.is_banned
                                                                      ? 'active'
                                                                      : 'inactive'
                                                              } statuses`}
                                                          >
                                                              {providerData?.is_banned
                                                                  ? t('labels.ban')
                                                                  : t('labels.un_ban')}
                                                          </span>
                                                      </>,
                                                  ]}
                                        </>
                                    }
                                />
                            </div>

                            <div className="grid items-center w-full mt-5 p-4 bg-transparent border border-gray-200 rounded-lg shadow-sm">
                                <h5 className="text-xl font-bold text-primary mb-3">
                                    {t('labels.work_times')}
                                </h5>

                                {providerData?.work_times_data &&
                                providerData?.work_times_data.length > 0 ? (
                                    <>
                                        <div className="grid grid-cols-3 gap-2 font-bold text-black text-lg mb-2">
                                            <span>{t('labels.from')}</span>
                                            <span>{t('labels.to')}</span>
                                            <span>{t('labels.service')}</span>
                                        </div>

                                        {providerData.work_times_data.map(
                                            (detail: any, index: number) => (
                                                <div
                                                    key={index}
                                                    className="grid grid-cols-3 gap-2 mb-2 border-b pb-2"
                                                >
                                                    <span className="text-gray-500 font-semibold">
                                                        {detail?.from}
                                                    </span>
                                                    <span className="text-gray-500 font-semibold">
                                                        {detail?.to}
                                                    </span>
                                                    <span className="text-gray-500 font-semibold">
                                                        {detail?.service_data?.service}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </>
                                ) : (
                                    <div className="text-gray-500 font-semibold mt-3 mx-auto">
                                        {t('labels.no_sub_categories')}
                                    </div>
                                )}
                            </div>

                            <div className="grid items-center w-full mt-5 p-4 bg-transparent rounded-lg">
                                <div className="flex flex-wrap justify-between">
                                    <h5 className="text-xl font-bold text-primary mb-3">
                                        {t('labels.wallet')}
                                    </h5>
                                </div>

                                <h5 className="font-semibold text-lg mb-3">
                                    {t('labels.balance')}: {providerData?.wallet_data?.balance}
                                </h5>

                                <h5 className="text-xl font-bold text-primary mb-3">
                                    {t('labels.transactions')}
                                </h5>

                                <TableCompCustom
                                    showOnly={true}
                                    columns={transactionsColumns}
                                    data={providerData?.wallet_data?.transactions || []}
                                    title={t('buttons.add')}
                                    isLoading={showDataLoading}
                                />
                            </div>

                            <div className="grid items-center w-full mt-5 p-4 bg-transparent rounded-lg">
                                <h5 className="text-xl font-bold text-primary mb-3">
                                    {t('labels.bookings')}
                                </h5>

                                <TableCompCustom
                                    showOnly={true}
                                    columns={bookingColumns}
                                    data={providerData?.bookings || []}
                                    isLoading={showDataLoading}
                                />
                            </div>

                            {providerData?.reviews?.length > 0 && (
                                <div className="reviews-section w-full p-5 mt-3 space-y-6">
                                    <h5 className="text-xl font-bold text-primary mb-3">
                                        {t('labels.reviews')}
                                    </h5>
                                    {providerData?.reviews?.map((review: any, index: number) => (
                                        <>
                                            <div
                                                key={index}
                                                className=" flex flex-wrap gap-2 p-4 border rounded-md shadow-sm"
                                            >
                                                {(review?.client_data?.image && (
                                                    <img
                                                        className="w-10 h-10 rounded-full object-cover"
                                                        onError={(e: any) =>
                                                            (e.target.src = defaultAvatar)
                                                        }
                                                        src={review?.client_data?.image}
                                                        alt={review?.client_data?.full_name}
                                                    />
                                                )) || (
                                                    <div className="w-10 h-10 bg-[#D9D9D9] rounded-full flex items-center justify-center">
                                                        <span className="text-lg font-bold text-gray-700">
                                                            {review?.client_data?.full_name.charAt(
                                                                0
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-bold">
                                                            {review?.client_data?.full_name}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {review?.created_at}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center mb-2">
                                                        <Rating
                                                            value={review?.rate}
                                                            onChange={review?.rate}
                                                        />
                                                    </div>
                                                    <p>{review?.comment}</p>
                                                </div>
                                            </div>
                                        </>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </>
    );
}
