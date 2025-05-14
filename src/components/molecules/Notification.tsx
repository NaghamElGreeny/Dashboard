import Cookies from 'js-cookie';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBell } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { IRootState } from '../../store';
import ShowAlertMixin from '../atoms/ShowAlertMixin';
import Dropdown from '../Dropdown';
import { Skeleton } from '@mantine/core';

const DropDownNotification = ({
    notifications,
    count_unread_notification,
    refetch,
    isLoading,
}: {
    notifications: any;
    count_unread_notification?: number;
    refetch?: () => void;
    isLoading?: boolean;
}) => {
    const baseURL = import.meta.env.VITE_BASE_URL;
    const user_token = Cookies.get('token');
    const token = user_token;

    const authorizationHeader = `Bearer ${token}`;

    const isRtl =
        useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const { t, i18n } = useTranslation();

    const navigate = useNavigate();

    // Create a ref for the Dropdown component
    const dropdownRef = useRef<{ close: () => void } | null>();

    const handleReadNotification = async (id: number, type?: string) => {
        try {
            const res = await fetch(`${baseURL}/notification/${id}`, {
                method: 'GET',
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

            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title: t('notificationShowedSuccessfully'),
            });

            // Close dropdown when response is OK
            if (dropdownRef.current) {
                dropdownRef.current.close();
            }

            if (type === 'contact') {
                navigate('/contact-messages');
            } else {
                navigate('/notifications/index');
            }
            refetch && refetch();
        } catch (err: any) {
            // Show error message to the user
            ShowAlertMixin({
                type: 15,
                icon: 'error',
                title: err?.response?.data?.message || err?.message,
            });
        }
    };

    return (
        <div className="dropdown shrink-0">
            <Dropdown
                ref={dropdownRef} // Attach the ref to the Dropdown component
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                button={
                    <span>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M19.0001 9.7041V9C19.0001 5.13401 15.8661 2 12.0001 2C8.13407 2 5.00006 5.13401 5.00006 9V9.7041C5.00006 10.5491 4.74995 11.3752 4.28123 12.0783L3.13263 13.8012C2.08349 15.3749 2.88442 17.5139 4.70913 18.0116C9.48258 19.3134 14.5175 19.3134 19.291 18.0116C21.1157 17.5139 21.9166 15.3749 20.8675 13.8012L19.7189 12.0783C19.2502 11.3752 19.0001 10.5491 19.0001 9.7041Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path
                                d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                            <path
                                d="M12 6V10"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                        </svg>
                        {/* {count_unread_notification && count_unread_notification >= 0 && (
                            <span className="flex absolute w-4 h-4 ltr:right-0 rtl:left-0 top-0">
                                <span className="relative inline-flex p-3 items-center justify-center text-white text-xs font-bold rounded-full w-4 h-4 bg-secondary">
                                    {count_unread_notification}
                                </span>
                            </span>
                        )} */}

                        {count_unread_notification && count_unread_notification >= 0 ? (
                            <span className="flex absolute w-3 h-3 ltr:right-0 rtl:left-0 top-0">
                                <span className="animate-ping absolute ltr:-left-[3px] rtl:-right-[3px] -top-[3px] inline-flex h-full w-full rounded-full bg-secondary/50 opacity-75"></span>
                                <span className="relative inline-flex rounded-full w-[6px] h-[6px]  bg-secondary"></span>
                            </span>
                        ) : (
                            ''
                        )}
                    </span>
                }
                btnClick={refetch}
            >
                <ul className="!py-0 text-dark dark:text-white-dark w-[300px] sm:w-[350px] divide-y dark:divide-white/10">
                    <li
                        className="sticky top-0 bg-white dark:bg-dark z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center px-4 py-2 justify-between font-semibold">
                            <h4 className="text-lg">{t('labels.notifications')}</h4>
                            {notifications?.data?.length ? (
                                <span className="badge bg-primary/80">
                                    {t('labels.all_notifications')}: {notifications?.meta?.total}
                                </span>
                            ) : (
                                ''
                            )}
                        </div>
                    </li>
                    {notifications?.data?.length > 0 ? (
                        <>
                            <div className="max-h-[320px] overflow-y-auto">
                                {notifications?.data?.map((notification: any, index: number) => {
                                    return (
                                        <div key={notification?.id || `notification-${index}`}>
                                            {isLoading ? (
                                                <Skeleton height={40} className="w-full mb-1" />
                                            ) : (
                                                <li
                                                    className="dark:text-white-light/90"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="group flex items-center px-4 py-2">
                                                        <div className="grid place-content-center rounded">
                                                            <div className="w-12 h-12 relative">
                                                                <FaBell className="w-10 h-10 rounded-full text-primary" />
                                                                {!notification.is_readed && (
                                                                    <>
                                                                        <span className="flex absolute w-3 h-3 right-[4px] bottom-0">
                                                                            <span className="animate-ping absolute ltr:-left-[2px] rtl:-right-[2px] -top-[2px] inline-flex h-full w-full rounded-full bg-secondary/50 opacity-75"></span>
                                                                            <span className="relative inline-flex rounded-full w-2 h-2 bg-secondary"></span>
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="ltr:pl-1 rtl:pr-1 flex flex-auto cursor-pointer justify-between"
                                                            onClick={() => {
                                                                handleReadNotification(
                                                                    notification?.id,
                                                                    notification?.notify_type
                                                                );
                                                            }}
                                                        >
                                                            <div className="ltr:pr-3 rtl:pl-3">
                                                                <h6
                                                                    className="font-bold"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: notification.title,
                                                                    }}
                                                                ></h6>
                                                                <h6
                                                                    className="text-gray-500 font-semibold"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: notification.body,
                                                                    }}
                                                                ></h6>
                                                            </div>
                                                            <span className="text-xs font-normal dark:text-gray-500 text-end">
                                                                {notification.sending_time}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </li>
                                            )}
                                            <hr />
                                        </div>
                                    );
                                })}
                            </div>
                            <li className="sticky bottom-0 bg-white dark:bg-dark z-10">
                                <div className="p-4">
                                    <Link
                                        to="/notifications/index"
                                        className="text-center block w-full "
                                    >
                                        {t('buttons.show_all')}
                                    </Link>
                                </div>
                            </li>
                        </>
                    ) : (
                        <li onClick={(e) => e.stopPropagation()}>
                            <button
                                type="button"
                                className="!grid place-content-center hover:!bg-transparent text-lg min-h-[200px]"
                            >
                                <div className="mx-auto ring-4 ring-primary/30 rounded-full mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="40"
                                        height="40"
                                        viewBox="0 0 24 24"
                                        fill="#a9abb6"
                                        stroke="#ffffff"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-info bg-primary rounded-full"
                                    >
                                        <line x1="12" y1="16" x2="12" y2="12"></line>
                                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                    </svg>
                                </div>
                                {t('no_data')}
                            </button>
                        </li>
                    )}
                </ul>
            </Dropdown>
        </div>
    );
};

export default DropDownNotification;
