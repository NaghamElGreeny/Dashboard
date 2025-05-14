import { MRT_ColumnDef } from 'mantine-react-table';
import { useTranslation } from 'react-i18next';
import { FaEye, FaTransgender } from 'react-icons/fa';
import {
    MdEmail,
    MdOutlineDateRange,
    MdOutlineEmojiFlags,
    MdOutlineVerifiedUser,
    MdPhone,
} from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../components/molecules/BreadCrumbs';
import useFetch from '../../../hooks/UseFetch';
import { useIsRTL } from '../../../hooks/useIsRTL';
import { useMutate } from '../../../hooks/UseMutate';
import Loading from '../../atoms/loading';
import showAlert from '../../atoms/ShowAlert';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import CardItem from '../../molecules/CardItem';
import LightBox from '../../molecules/LightBox/LightBox';
import Switcher from '../../molecules/Switcher';
import TableCompCustom from '../tantable/TableCutsom';
import defaultAvatar from '/assets/images/avatar.jpg';
import { hasPermission } from '../../../helper/permissionHelpers';
import imageError from '/assets/images/logo.png';
import Rating from '../../molecules/Rating/Rating';

export default function ShowUser() {
    const { t } = useTranslation();

    const { id } = useParams();

    const rtl = useIsRTL();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.users.title'), to: '/users/index' },
        { label: t('breadcrumb.users.show') },
    ];

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `users/${id}`,
        queryKey: [`users/${id}`],
    });

    const { mutate: ChangeBanMutate } = useMutate({
        mutationKey: [`toggle-ban-user/${id}`],
        endpoint: `toggle-ban-user/${id}`,
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
        showAlert(
            t('toggle_status_confirmation'),
            '',
            false,
            t('ok'),
            true,
            'warning',
            () => ChangeBanMutate({ is_ban: newStatus, _method: 'patch' })
            // () => ChangeBanMutate({ is_ban: newStatus })
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
            accessorKey: 'status',
            header: t('labels.status'),
            Cell: ({ row }: any) => {
                const status = row.original?.status;
                return (
                    <span className={`${row.original?.status} statuses font-medium p-2`}>
                        {status ? t(`status.${status}`) : '---'}
                    </span>
                );
            },
        },

        {
            header: t('labels.created_at'),
            accessorKey: 'date',
            Cell: ({ row }: any) => {
                return <span>{row.original.created_at || t('not_found')}</span>;
            },
        },
    ];

    const ordersColumns: MRT_ColumnDef[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.order_no'),
            accessorKey: 'order_no',
            Cell: ({ row }: any) => {
                const order_no = row.original?.order_no || '---';
                return <span className="text-success font-medium">#{order_no}</span>;
            },
            size: 40,
        },

        {
            header: t('labels.payment_type'),
            Cell: ({ row }: any) => {
                const payment_type = row.original.payment_type;
                return <span>{payment_type ? t(`labels.${payment_type}`) : '---'}</span>;
            },
            accessorKey: 'payment_type',
        },

        {
            accessorKey: 'status',
            header: t('labels.status'),
            Cell: ({ row }: any) => {
                const status = row.original?.status;
                return (
                    <span className={`${row.original?.status} statuses font-medium p-2`}>
                        {status ? t(`status.${status}`) : '---'}
                    </span>
                );
            },
        },

        {
            header: t('labels.created_at'),
            Cell: ({ row }: any) => {
                const created_at = row.original.created_at;
                return <span>{created_at || '---'}</span>;
            },
            accessorKey: 'created_at',
        },

        ...(hasPermission('show-Order')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ row }: any) => (
                          <div
                              className="flex gap-2 items-center"
                              style={{ marginInlineStart: '1rem' }}
                          >
                              <Link to={`/orders/show/${row.original?.id}`} className="flex gap-5">
                                  <FaEye className="text-[19px] text-secondary ms-8" />
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
                                <LightBox
                                    isShow
                                    getItems={[
                                        {
                                            src: showData?.data?.image || defaultAvatar,
                                            title: showData?.data?.name,
                                        },
                                    ]}
                                />
                                <h2 className="text-2xl font-bold text-primary mt-4">
                                    {showData?.data?.name || 'User'}
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 w-full">
                                    {/* email */}
                                    <CardItem
                                        icon={<MdEmail className="w-8 h-8" />}
                                        label={t('labels.email')}
                                        value={showData?.data?.email || t('not_found')}
                                    />

                                    {/* country */}
                                    <CardItem
                                        icon={<MdOutlineEmojiFlags className="w-8 h-8" />}
                                        label={t('labels.country')}
                                        value={showData?.data?.country?.name || t('not_found')}
                                    />

                                    {/* Phone Number */}
                                    <CardItem
                                        icon={<MdPhone className="w-8 h-8" />}
                                        label={t('labels.phone')}
                                        value={
                                            showData?.data?.phone_complete_form || t('not_found')
                                        }
                                    />

                                    {/* date_of_birth */}
                                    <CardItem
                                        icon={<MdOutlineDateRange className="w-8 h-8" />}
                                        label={t('labels.date_of_birth')}
                                        value={showData?.data?.date_of_birth || t('not_found')}
                                    />

                                    {/* gender */}
                                    <CardItem
                                        icon={<FaTransgender className="w-8 h-8" />}
                                        label={t('labels.gender')}
                                        value={
                                            t(`labels.${showData?.data?.gender}`) || t('not_found')
                                        }
                                    />

                                    {/* status */}
                                    <CardItem
                                        hasToggle
                                        icon={<MdOutlineVerifiedUser className="w-8 h-8" />}
                                        label={t('labels.status')}
                                        value={
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
                                            </>
                                        }
                                    />

                                    {/* is_ban */}
                                    <CardItem
                                        hasToggle
                                        icon={<MdOutlineVerifiedUser className="w-8 h-8" />}
                                        label={t('labels.is_ban')}
                                        value={
                                            <Switcher
                                                label={
                                                    showData.data?.is_ban
                                                        ? t('labels.ban')
                                                        : t('labels.un_ban')
                                                }
                                                checked={!showData.data?.is_ban}
                                                onChange={() => {
                                                    const newStatus =
                                                        showData.data?.is_ban === true ? 0 : 1;
                                                    changeBan(newStatus);
                                                }}
                                            />
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid items-center w-full mt-5 p-4 bg-transparent rounded-lg">
                                <h5 className="text-xl font-bold text-secondary mb-3">
                                    {t('labels.wallet')}
                                </h5>

                                <h5 className="font-semibold text-lg mb-3">
                                    {t('labels.balance')}: {showData?.data?.wallet?.balance || 0}
                                </h5>

                                <TableCompCustom
                                    showOnly={true}
                                    columns={transactionsColumns}
                                    data={showData?.data?.wallet?.wallet_transactions || []}
                                    title={t('labels.wallet')}
                                    isLoading={showDataLoading}
                                />
                            </div>

                            <div className="grid items-center w-full mt-5 p-4 bg-transparent rounded-lg">
                                <h5 className="text-xl font-bold text-secondary mb-3">
                                    {t('labels.orders')}
                                </h5>

                                <TableCompCustom
                                    showOnly={true}
                                    columns={ordersColumns}
                                    data={showData?.data?.orders || []}
                                    title={t('labels.orders')}
                                    isLoading={showDataLoading}
                                />
                            </div>

                            {showData?.data?.reviews?.length > 0 && (
                                <div className="reviews-section bg-white shadow rounded-lg p-5 mt-3 space-y-6">
                                    <h5 className="text-xl font-bold text-secondary mb-3">
                                        {t('labels.reviews')}
                                    </h5>
                                    {showData?.data?.reviews?.map((review: any, index: number) => (
                                        <div
                                            key={index}
                                            className="p-4 border rounded-md shadow-sm"
                                        >
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-lg">
                                                    {showData?.data?.name}
                                                </h3>
                                                <div className="flex items-center space-x-1">
                                                    <Rating
                                                        value={review?.rate}
                                                        onChange={review?.rate}
                                                    />
                                                </div>
                                            </div>

                                            <div className="text-sm text-gray-500 mt-1 mb-2">
                                                {review?.color && (
                                                    <span>
                                                        {t('labels.color')}: {review.color}
                                                    </span>
                                                )}
                                                {review?.color && review?.size && (
                                                    <span className="mx-2">/</span>
                                                )}
                                                {review?.size && (
                                                    <span>
                                                        {t('labels.size')}: {review.size}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mb-3">{review?.review}</p>

                                            <div className="flex space-x-2">
                                                <img
                                                    src={review?.image?.media || imageError}
                                                    alt="review-img"
                                                    onError={(e: any) =>
                                                        (e.target.src = imageError)
                                                    }
                                                    className="w-20 h-20 object-cover rounded-md border"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
}
