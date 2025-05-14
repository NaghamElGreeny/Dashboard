import { MRT_ColumnDef } from 'mantine-react-table';
import moment from 'moment/moment';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdEmail, MdOutlineVerifiedUser, MdPhone } from 'react-icons/md';

import Cookies from 'js-cookie';
import { FaCalendar, FaEye, FaUser } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../components/molecules/BreadCrumbs';
import useFetch from '../../../hooks/UseFetch';
import { useIsRTL } from '../../../hooks/useIsRTL';
import { useMutate } from '../../../hooks/UseMutate';
import Loading from '../../atoms/loading';
import showAlert from '../../atoms/ShowAlert';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import CardItem from '../../molecules/CardItem';
import Switcher from '../../molecules/Switcher';
import ModalCustom from '../modal/ModalCustom';
import TableCompCustom from '../tantable/TableCutsom';
import Wallet from '../Wallet/Wallet';
import { hasPermission } from '../../../helper/permissionHelpers';
import { BiSolidReport } from 'react-icons/bi';
import LightBox from '../../molecules/LightBox/LightBox';
import imageError from '/assets/images/logo.png';
import VideoLightBox from '../../molecules/VideoLightBox/VideoLightBox';
import Rating from '../../molecules/Rating/Rating';
import defaultAvatar from '/assets/images/avatar.jpg';

export default function ShowClient() {
    const { t } = useTranslation();

    const { id } = useParams();

    const [walletModalOpened, setWalletModalOpen] = useState<boolean>(false);

    const rtl = useIsRTL();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.clients.title'), to: '/clients/index' },
        { label: t('breadcrumb.clients.show') },
    ];

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `client/${id}`,
        queryKey: [`client/${id}`],
    });

    const { mutate: ChangeBanMutate } = useMutate({
        mutationKey: [`client/toggle-ban/${id}`],
        endpoint: `client/toggle-ban/${id}`,
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

    const { mutate: ChangeActiveMutate } = useMutate({
        mutationKey: [`client/toggle-active/${id}`],
        endpoint: `client/toggle-active/${id}`,
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
        showAlert(
            t('toggle_status_confirmation'),
            '',
            false,
            t('ok'),
            true,
            'warning',

            () => ChangeActiveMutate({ is_active: newStatus })
        );
    };

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
                const type = row.original.type || t('not_found');
                return <span>{t(`labels.${type}`)}</span>;
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

    const registeredCoursesColumns: MRT_ColumnDef[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.image'),
            Cell: ({ row }: { row: { original: any } }) => (
                <div className="flex gap-5">
                    <LightBox
                        getItems={[
                            {
                                src: row.original.image || imageError,
                            },
                        ]}
                    />
                </div>
            ),
            accessorKey: 'image',
        },

        {
            header: t('labels.watched_videos'),
            Cell: ({ row }: { row: { original: any } }) => (
                <div className="flex gap-5">
                    {row.original?.watched_videos && row.original?.watched_videos.length > 0 ? (
                        <VideoLightBox
                            videos={row.original?.watched_videos} // Pass all videos to the lightbox
                            startIndex={0} // Ensure it starts with the first video
                            showFirstOnly={true} // prop to display only the first video in the table
                        />
                    ) : (
                        <span>{t('not_found')}</span>
                    )}
                </div>
            ),
            accessorKey: 'videos',
        },

        {
            header: t('labels.un_watched_videos'),
            Cell: ({ row }: { row: { original: any } }) => (
                <div className="flex gap-5">
                    {row.original?.un_watched_videos &&
                    row.original?.un_watched_videos.length > 0 ? (
                        <VideoLightBox
                            videos={row.original?.un_watched_videos} // Pass all videos to the lightbox
                            startIndex={0} // Ensure it starts with the first video
                            showFirstOnly={true} // prop to display only the first video in the table
                        />
                    ) : (
                        <span>{t('not_found')}</span>
                    )}
                </div>
            ),
            accessorKey: 'videos',
        },

        {
            header: t('labels.title'),
            Cell: ({ row }: any) => {
                const title = row.original?.title || t('not_found');
                return <span>{title}</span>;
            },
            accessorKey: 'title',
        },

        {
            header: t('labels.instructor_name'),
            Cell: ({ row }: any) => {
                const instructor_name = row.original?.instructor_name || t('not_found');
                return <span>{instructor_name}</span>;
            },
            accessorKey: 'instructor_name',
        },

        {
            header: t('labels.videos_count'),
            Cell: ({ row }: any) => {
                const videos_count = row.original?.videos_count || 0;
                return <span>{videos_count}</span>;
            },
            accessorKey: 'videos_count',
        },

        {
            header: t('labels.completed_videos_percentage'),
            Cell: ({ row }: any) => {
                const completed_videos_percentage = row.original?.completed_videos_percentage || 0;
                return <span>{completed_videos_percentage}</span>;
            },
            accessorKey: 'completed_videos_percentage',
        },

        {
            header: t('labels.total_completed_videos_count'),
            Cell: ({ row }: any) => {
                const total_completed_videos_count =
                    row.original?.total_completed_videos_count || 0;
                return <span>{total_completed_videos_count}</span>;
            },
            accessorKey: 'total_completed_videos_count',
        },

        ...(hasPermission('course.show')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ row }: any) => (
                          <div className="flex gap-2 items-center ms-1">
                              <Link to={`/courses/show/${row.original.id}`} className="flex gap-5">
                                  <FaEye className="text-[19px] text-[#50cd89] ms-8" />
                              </Link>
                          </div>
                      ),
                      accessorKey: 'actions',
                  },
              ]
            : []),
    ];

    return (
        <>
            {(showDataLoading && <Loading />) || (
                <>
                    <Breadcrumb items={breadcrumbItems} />
                    {showDataSuccess && (
                        <>
                            <div className="flex flex-col items-center dark:bg-black bg-white shadow-lg rounded-lg p-6 w-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 w-full">
                                    {/* full_name */}
                                    <CardItem
                                        icon={<FaUser className="w-8 h-8" />}
                                        label={t('labels.full_name')}
                                        value={showData?.data?.full_name || t('not_found')}
                                    />

                                    {/* email */}
                                    <CardItem
                                        icon={<MdEmail className="w-8 h-8" />}
                                        label={t('labels.email')}
                                        value={showData?.data?.email || t('not_found')}
                                    />

                                    {/* birthdate */}
                                    <CardItem
                                        icon={<FaCalendar className="w-8 h-8" />}
                                        label={t('labels.birthdate')}
                                        value={showData?.data?.birthdate || t('not_found')}
                                    />

                                    {/* Phone Number */}
                                    <CardItem
                                        icon={<MdPhone className="w-8 h-8" />}
                                        label={t('labels.phone')}
                                        value={
                                            <>
                                                {rtl ? (
                                                    <span>
                                                        {showData?.data?.phone}{' '}
                                                        {showData?.data?.phone_code}
                                                    </span>
                                                ) : (
                                                    <span>
                                                        {showData?.data?.phone_code}{' '}
                                                        {showData?.data?.phone}
                                                    </span>
                                                )}
                                            </>
                                        }
                                    />

                                    {/* bookings_count */}
                                    <CardItem
                                        icon={<BiSolidReport className="w-8 h-8" />}
                                        label={t('labels.bookings_count')}
                                        value={showData?.data?.bookings_count || 0}
                                    />

                                    {/* daily_bookings_count */}
                                    <CardItem
                                        icon={<BiSolidReport className="w-8 h-8" />}
                                        label={t('labels.daily_bookings_count')}
                                        value={showData?.data?.daily_bookings_count || 0}
                                    />

                                    {/* monthly_bookings_count */}
                                    <CardItem
                                        icon={<BiSolidReport className="w-8 h-8" />}
                                        label={t('labels.monthly_bookings_count')}
                                        value={showData?.data?.monthly_bookings_count || 0}
                                    />

                                    {/* status */}
                                    <CardItem
                                        hasToggle
                                        icon={<MdOutlineVerifiedUser className="w-8 h-8" />}
                                        label={t('labels.status')}
                                        value={
                                            <>
                                                {hasPermission('client.toggle')
                                                    ? [
                                                          <Switcher
                                                              label={
                                                                  showData.data?.is_active
                                                                      ? t('labels.active')
                                                                      : t('labels.inactive')
                                                              }
                                                              checked={showData.data?.is_active}
                                                              onChange={() => {
                                                                  const newStatus =
                                                                      showData.data?.is_active ===
                                                                      true
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
                                                                      showData?.data?.is_active
                                                                          ? 'active'
                                                                          : 'inactive'
                                                                  } statuses`}
                                                              >
                                                                  {showData?.data?.is_active
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
                                                {hasPermission('client.toggleBan')
                                                    ? [
                                                          <Switcher
                                                              label={
                                                                  showData?.data?.is_banned
                                                                      ? t('labels.ban')
                                                                      : t('labels.un_ban')
                                                              }
                                                              checked={!showData?.data?.is_banned}
                                                              onChange={() => {
                                                                  const newStatus =
                                                                      showData?.data?.is_banned ===
                                                                      true
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
                                                                      !showData?.data?.is_banned
                                                                          ? 'active'
                                                                          : 'inactive'
                                                                  } statuses`}
                                                              >
                                                                  {showData?.data?.is_banned
                                                                      ? t('labels.ban')
                                                                      : t('labels.un_ban')}
                                                              </span>
                                                          </>,
                                                      ]}
                                            </>
                                        }
                                    />
                                </div>

                                <div className="grid items-center w-full mt-5 p-4 bg-transparent rounded-lg">
                                    <div className="flex flex-wrap justify-between">
                                        <h5 className="text-xl font-bold text-primary mb-3">
                                            {t('labels.wallet')}
                                        </h5>
                                    </div>

                                    <h5 className="font-semibold text-lg mb-3">
                                        {t('labels.balance')}:{' '}
                                        {showData?.data?.wallet_data?.balance}
                                    </h5>

                                    <h5 className="text-xl font-bold text-primary mb-3">
                                        {t('labels.transactions')}
                                    </h5>

                                    <TableCompCustom
                                        showOnly={true}
                                        columns={transactionsColumns}
                                        data={showData?.data?.wallet_data?.transactions || []}
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
                                        data={showData?.data?.bookings || []}
                                        isLoading={showDataLoading}
                                    />
                                </div>

                                <div className="grid items-center w-full mt-5 p-4 bg-transparent rounded-lg">
                                    <h5 className="text-xl font-bold text-primary mb-3">
                                        {t('labels.registered_courses')}
                                    </h5>

                                    <TableCompCustom
                                        showOnly={true}
                                        columns={registeredCoursesColumns}
                                        data={showData?.data?.registered_courses || []}
                                        isLoading={showDataLoading}
                                    />
                                </div>

                                {showData?.data?.reviews?.length > 0 && (
                                    <div className="reviews-section w-full p-5 mt-3 space-y-6">
                                        <h5 className="text-xl font-bold text-primary mb-3">
                                            {t('labels.reviews')}
                                        </h5>
                                        {showData?.data?.reviews?.map(
                                            (review: any, index: number) => (
                                                <>
                                                    <div
                                                        key={index}
                                                        className=" flex flex-wrap gap-2 p-4 border rounded-md shadow-sm"
                                                    >
                                                        {(review?.provider_data?.image && (
                                                            <img
                                                                className="w-10 h-10 rounded-full object-cover"
                                                                onError={(e: any) =>
                                                                    (e.target.src = defaultAvatar)
                                                                }
                                                                src={review?.provider_data?.image}
                                                                alt={
                                                                    review?.provider_data?.full_name
                                                                }
                                                            />
                                                        )) || (
                                                            <div className="w-10 h-10 bg-[#D9D9D9] rounded-full flex items-center justify-center">
                                                                <span className="text-lg font-bold text-gray-700">
                                                                    {review?.provider_data?.full_name.charAt(
                                                                        0
                                                                    )}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="font-bold">
                                                                    {
                                                                        review?.provider_data
                                                                            ?.full_name
                                                                    }
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
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <ModalCustom opened={walletModalOpened} setOpen={setWalletModalOpen}>
                        <div>
                            <Wallet
                                type="client"
                                dataInfo={id}
                                setOpen={setWalletModalOpen}
                                refetch={refetch}
                            />
                        </div>
                    </ModalCustom>
                </>
            )}
        </>
    );
}
