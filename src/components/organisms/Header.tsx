//@ts-nocheck
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { IRootState } from '../../store';
import { useTranslation } from 'react-i18next';
import CalendarIcon from '../atoms/icons/CalendarIcon';
import DropDownLang from '../molecules/DropDownLang';
import ThemeSwitch from '../molecules/ThemeSwitch';
import ToggleSidebarButton from '../atoms/buttons/ToggleSidebarButton';
import Dropdown from '../Dropdown';
import { AuthContext } from '../../Auth/AuthProvider';
import { useContext, useEffect, useState } from 'react';
import { useMutate } from '../../hooks/UseMutate';
import Swal from 'sweetalert2';
import DropDownNotification from '../molecules/Notification';
import defaultAvatar from '/assets/images/avatar.jpg';
import logo from '/assets/images/favicon.png';
import useFetch from '../../hooks/UseFetch';
import { hasPermission } from '../../helper/permissionHelpers';

const Header = () => {
    const [userData, setUserData] = useState([]);

    const { logout } = useContext(AuthContext);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);

    const { t } = useTranslation();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userObject = JSON.parse(storedUser);
            setUserData(userObject);
        }
    }, []);

    const isRtl =
        useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    // mutate logout
    const { mutate } = useMutate({
        mutationKey: ['auth/logout'],
        endpoint: `auth/logout`,
        onSuccess: (data: any) => {
            Swal.fire({
                title: t('logout'),
                text: t('logoutSuccessfully'),
                icon: 'success',
                customClass: 'sweet-alerts',
            });
            logout();
            location.replace('/login');
        },
        onError: (err: any) => {
            if (err.response && err.response.status === 401) {
                logout();
                window.location.replace('/login');
            } else {
                Swal.fire({
                    title: t('error'),
                    text: err?.response?.data?.message,
                    icon: 'error',
                    customClass: 'sweet-alerts',
                });
            }
        },
        formData: true,
    });

    // const [notifications, setNotifications] = useState([]);

    // const {
    //     data: notifications,
    //     isError: notificationsError,
    //     isLoading: notificationsLoading,
    //     isSuccess: notificationsSuccess,
    //     refetch: refetch,
    // } = useFetch<any>({
    //     endpoint: `notification`,
    //     queryKey: [`notification`, hasPermission('notification.index')],
    //     enabled: !!hasPermission('notification.index'),
    // });
    return (
        <header className={themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}>
            <div className="shadow-sm floating-height-c">
                <div className="relative floating-height-c bg-white flex w-full items-center px-5 py-2.5 dark:bg-black">
                    <div className="horizontal-logo flex lg:hidden gap-2 justify-between items-center ltr:mr-2 rtl:ml-2">
                        <Link to="/" className="main-logo flex items-center shrink-0">
                            <img className="w-8 ltr:-ml-1 rtl:-mr-1 inline" src={logo} alt="logo" />
                            <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5  font-semibold  align-middle hidden md:inline dark:text-white-light transition-all duration-300">
                                {t('sidebar.dashboard')}
                            </span>
                        </Link>
                        <ToggleSidebarButton />
                    </div>

                    <div className="floating-height-c sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
                        <div className="sm:ltr:mr-auto sm:rtl:ml-auto"></div>
                        <ThemeSwitch />
                        {/* <DropDownNotification
                            refetch={refetch}
                            notifications={notifications}
                            count_unread_notification={notifications?.unread_notifications}
                            isLoading={notificationsLoading}
                        /> */}

                        <DropDownLang />
                    </div>
                    <div className="dropdown shrink-0 flex mx-2">
                        <Dropdown
                            offset={[0, 8]}
                            placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                            btnClassName="relative group block"
                            button={
                                <img
                                    onError={(e) => (e.target.src = defaultAvatar)}
                                    className="w-9 h-9 rounded-full object-cover saturate-50 group-hover:saturate-100"
                                    src={userData?.image?.url || defaultAvatar}
                                    alt="userProfile"
                                />
                            }
                        >
                            <ul className="text-dark dark:text-white-dark !py-0 w-[230px] font-semibold dark:text-white-light/90">
                                <li>
                                    <Link to={'/profile'} className="flex items-center px-5 py-5">
                                        <img
                                            onError={(e) => (e.target.src = defaultAvatar)}
                                            className="rounded-md w-10 h-10 object-cover"
                                            src={userData?.image?.url || defaultAvatar}
                                            alt="userProfile"
                                        />
                                        <div className="ltr:pl-4 rtl:pr-4">
                                            <h4 className="text-base">
                                                {userData?.full_name?.length > 5
                                                    ? `${userData.full_name.slice(0, 5)}...`
                                                    : userData?.full_name}
                                                <span className="text-xs bg-success-light rounded text-success px-1 ltr:ml-2 rtl:ml-2">
                                                    {userData?.user_type}
                                                </span>
                                            </h4>
                                            <button
                                                type="button"
                                                className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white"
                                            >
                                                {userData?.email?.length > 17
                                                    ? `${userData.email.slice(0, 17)}...`
                                                    : userData?.email}
                                            </button>
                                        </div>
                                    </Link>
                                    <Link
                                        to={'/profile/edit'}
                                        className="flex items-center px-5 py-5"
                                    >
                                        <span>{t('labels.edit_profile')}</span>
                                    </Link>
                                    <Link
                                        to={'/profile/change-password'}
                                        className="flex items-center px-5 py-5"
                                    >
                                        <span>{t('labels.change_password')}</span>
                                    </Link>
                                </li>

                                <li className="border-t border-white-light dark:border-white-light/10 mt-5">
                                    <button className="flex flex-row" onClick={() => mutate({})}>
                                        <svg
                                            className="ltr:mr-2 rtl:ml-2 rotate-90"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                opacity="0.5"
                                                d="M17 9.00195C19.175 9.01406 20.3529 9.11051 21.1213 9.8789C22 10.7576 22 12.1718 22 15.0002V16.0002C22 18.8286 22 20.2429 21.1213 21.1215C20.2426 22.0002 18.8284 22.0002 16 22.0002H8C5.17157 22.0002 3.75736 22.0002 2.87868 21.1215C2 20.2429 2 18.8286 2 16.0002L2 15.0002C2 12.1718 2 10.7576 2.87868 9.87889C3.64706 9.11051 4.82497 9.01406 7 9.00195"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                            />
                                            <path
                                                d="M12 15L12 2M12 2L15 5.5M12 2L9 5.5"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        {t('buttons.sign_out')}
                                    </button>
                                </li>
                            </ul>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
