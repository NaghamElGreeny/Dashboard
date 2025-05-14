import { useEffect, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { useTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { IRootState } from '../../store';
import { toggleSidebar } from '../../store/themeConfigSlice';

import logo from '/assets/images/logo.png';
import { SideBarItemsFn } from '../atoms/sidebarItems';

const Sidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    // Call the function to get sidebar items
    const sideBarItems = SideBarItemsFn();

    useEffect(() => {
        // Check if the current path matches any of the menu items or sub-items
        const matchedMenu = sideBarItems.find((item) => {
            if (item.items) {
                return item.items.some((subItem) => subItem.link === location.pathname);
            }
            return item.link === location.pathname;
        });

        if (matchedMenu) {
            setCurrentMenu(matchedMenu.label || '');
        }

        // Close sidebar on mobile if location changes
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${
                    semidark ? 'text-white-dark' : ''
                }`}
            >
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/" className="main-logo flex items-center shrink-0">
                            <img className="w-8 ml-[5px] mx-auto flex-none" src={logo} alt="logo" />
                            <span className="text-xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">
                                {t('sidebar.dashboard')}
                            </span>
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 m-auto"
                            >
                                <path
                                    d="M13 19L7 12L13 5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    opacity="0.5"
                                    d="M16.9998 19L10.9998 12L16.9998 5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>

                    <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
                        <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                            {sideBarItems.map((item, index) => (
                                <div key={index}>
                                    {item.heading ? (
                                        <div className="py-3 px-7 text-primary flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                                            {item.heading}
                                        </div>
                                    ) : !item.items ? (
                                        <li className="nav-item">
                                            <NavLink
                                                to={item.link ? item.link : ''}
                                                className="group active-and-hover-side"
                                            >
                                                <div className="flex items-center ">
                                                    <span className="group-hover:!text-primary">
                                                        {item.icon}
                                                    </span>
                                                    <span className="ltr:pl-3 rtl:pr-3 group-hover:!text-primary text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        {item.label}
                                                    </span>
                                                </div>
                                            </NavLink>
                                        </li>
                                    ) : (
                                        <li className="menu nav-item">
                                            <button
                                                type="button"
                                                className={`active-and-hover-side ${
                                                    currentMenu === item.label ? 'active' : ''
                                                } nav-link group w-full`}
                                                onClick={() => toggleMenu(item.label!)}
                                            >
                                                <div className="flex items-center">
                                                    {item.icon}
                                                    <span className="ltr:pl-3 rtl:pr-3 group-hover:!text-primary text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        {item.label}
                                                    </span>
                                                </div>
                                                <div
                                                    className={
                                                        currentMenu === item.label
                                                            ? 'rotate-90'
                                                            : 'rtl:rotate-180'
                                                    }
                                                >
                                                    <svg
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M9 5L15 12L9 19"
                                                            stroke="currentColor"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </div>
                                            </button>

                                            <AnimateHeight
                                                duration={300}
                                                height={currentMenu === item.label ? 'auto' : 0}
                                            >
                                                <ul className="sub-menu text-gray-500">
                                                    {item.items.map((subItem) => (
                                                        <li key={subItem.id}>
                                                            <NavLink
                                                                to={
                                                                    subItem.link ? subItem.link : ''
                                                                }
                                                            >
                                                                {subItem.label}
                                                            </NavLink>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </AnimateHeight>
                                        </li>
                                    )}
                                </div>
                            ))}
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
