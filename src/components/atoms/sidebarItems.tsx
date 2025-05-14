import { IconPasswordUser } from '@tabler/icons-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaBell, FaDiscourse, FaLayerGroup, FaUsers, FaWallet } from 'react-icons/fa';
import { IoBanOutline, IoSettingsOutline } from 'react-icons/io5';
import {
    MdAdminPanelSettings,
    MdArticle,
    MdFolderSpecial,
    MdHomeFilled,
    MdLanguage,
    MdLocationCity,
    MdMessage,
    MdOutlineEmojiFlags,
    MdOutlineImage,
    MdOutlinePercent,
    MdOutlineReport,
} from 'react-icons/md';
import { BiSolidReport } from 'react-icons/bi';
import { hasPermission } from '../../helper/permissionHelpers';
import PageIcon from './icons/PageIcon';

export type MenuItem_TP = {
    id?: string;
    icon?: React.ReactNode;
    label?: string;
    link?: string;
    heading?: string; // Add the heading property

    items?: {
        id?: string;
        icon?: React.ReactNode;
        label?: string;
        link?: string;
        items?: MenuItem_TP[];
    }[];
};

export const SideBarItemsFn = () => {
    const { t } = useTranslation();

    const sideBarItems: MenuItem_TP[] = [
        {
            id: crypto.randomUUID(),
            icon: <MdHomeFilled />,
            label: t('sidebar.home'),
            link: '/',
        },

        // ...(hasPermission('financial-reports.index')
        //     ? [
        //         {
        //             id: crypto.randomUUID(),
        //             icon: <BiSolidReport />,
        //             label: t('sidebar.financial_reports'),
        //             link: '/financial-reports',
        //         },
        //     ]
        //     : []),

        // notifications
        ...(hasPermission('notification.index') || hasPermission('notification.store')
            ? [
                {
                    id: crypto.randomUUID(),
                    icon: <FaBell />,
                    label: t('sidebar.notifications'),
                    link: '/notifications',
                    items: [
                        ...(hasPermission('notification.index')
                            ? [
                                {
                                    id: crypto.randomUUID(),
                                    icon: <PageIcon />,
                                    label: t('breadcrumb.notifications.all'),
                                    link: '/notifications/index',
                                },
                            ]
                            : []),
                        ...(hasPermission('notification.store')
                            ? [
                                {
                                    id: crypto.randomUUID(),
                                    icon: <PageIcon />,
                                    label: t('breadcrumb.notifications.send_notification'),
                                    link: '/notifications/add',
                                },
                            ]
                            : []),
                    ],
                },
            ]
            : []),

        //sliders
        ...(hasPermission('slider.index') || hasPermission('slider.store')
            ? [
                {
                    id: crypto.randomUUID(),
                    icon: <MdOutlineImage />,
                    label: t('sidebar.sliders'),
                    link: '/sliders',
                    items: [
                        ...(hasPermission('slider.index')
                            ? [
                                {
                                    id: crypto.randomUUID(),
                                    icon: <PageIcon />,
                                    label: t('breadcrumb.sliders.all'),
                                    link: '/sliders/index',
                                },
                            ]
                            : []),
                        ...(hasPermission('slider.store')
                            ? [
                                {
                                    id: crypto.randomUUID(),
                                    icon: <PageIcon />,
                                    label: t('breadcrumb.sliders.add'),
                                    link: '/sliders/add',
                                },
                            ]
                            : []),
                    ],
                },
            ]
            : []),


        // coupon
        ...(hasPermission('coupon.index') || hasPermission('coupon.store')
            ? [
                {
                    id: crypto.randomUUID(),
                    icon: <MdOutlinePercent />,
                    label: t('sidebar.coupons'),
                    link: '/coupons',
                    items: [
                        ...(hasPermission('coupon.index')
                            ? [
                                {
                                    id: crypto.randomUUID(),
                                    icon: <PageIcon />,
                                    label: t('breadcrumb.coupons.all'),
                                    link: '/coupons/index',
                                },
                            ]
                            : []),
                        ...(hasPermission('coupon.store')
                            ? [
                                {
                                    id: crypto.randomUUID(),
                                    icon: <PageIcon />,
                                    label: t('breadcrumb.coupons.add'),
                                    link: '/coupons/add',
                                },
                            ]
                            : []),
                    ],
                },
            ]
            : []),

        // cancelReason
        ...(hasPermission('cancel-reason.index') || hasPermission('cancel-reason.store')
            ? [
                {
                    id: crypto.randomUUID(),
                    icon: <IoBanOutline />,
                    label: t('sidebar.cancelReasons'),
                    link: '/cancel-reasons',
                    items: [
                        ...(hasPermission('cancel-reason.index')
                            ? [
                                {
                                    id: crypto.randomUUID(),
                                    icon: <PageIcon />,
                                    label: t('breadcrumb.cancelReasons.all'),
                                    link: '/cancel-reasons/index',
                                },
                            ]
                            : []),
                        ...(hasPermission('cancel-reason.store')
                            ? [
                                {
                                    id: crypto.randomUUID(),
                                    icon: <PageIcon />,
                                    label: t('breadcrumb.cancelReasons.add'),
                                    link: '/cancel-reasons/add',
                                },
                            ]
                            : []),
                    ],
                },
            ]
            : []),

        // SpecialtyCases
        ...(hasPermission('speciality-case.index') || hasPermission('speciality-case.store')
            ? [
                {
                    id: crypto.randomUUID(),
                    icon: <MdFolderSpecial />,
                    label: t('sidebar.specialtyCases'),
                    link: '/specialty-cases',
                    items: [
                        ...(hasPermission('speciality-case.index')
                            ? [
                                {
                                    id: crypto.randomUUID(),
                                    icon: <PageIcon />,
                                    label: t('breadcrumb.specialtyCases.all'),
                                    link: '/specialty-cases/index',
                                },
                            ]
                            : []),
                        ...(hasPermission('speciality-case.store')
                            ? [
                                {
                                    id: crypto.randomUUID(),
                                    icon: <PageIcon />,
                                    label: t('breadcrumb.specialtyCases.add'),
                                    link: '/specialty-cases/add',
                                },
                            ]
                            : []),
                    ],
                },
            ]
            : []),

        // Language
        ...(hasPermission('language.index') || hasPermission('language.store')
            ? [
                {
                    id: crypto.randomUUID(),
                    icon: <MdLanguage />,
                    label: t('sidebar.languages'),
                    link: '/languages',
                    items: [
                        ...(hasPermission('language.index')
                            ? [
                                {
                                    id: crypto.randomUUID(),
                                    icon: <PageIcon />,
                                    label: t('breadcrumb.languages.all'),
                                    link: '/languages/index',
                                },
                            ]
                            : []),
                        ...(hasPermission('language.store')
                            ? [
                                {
                                    id: crypto.randomUUID(),
                                    icon: <PageIcon />,
                                    label: t('breadcrumb.languages.add'),
                                    link: '/languages/add',
                                },
                            ]
                            : []),
                    ],
                },
            ]
            : []),

        ...(hasPermission('report.index')
            ? [
                {
                    id: crypto.randomUUID(),
                    icon: <BiSolidReport />,
                    label: t('sidebar.reports'),
                    link: '/reports/index',
                },
            ]
            : []),

        ...(hasPermission('service.index')
            ? [
                {
                    id: crypto.randomUUID(),
                    icon: <IoSettingsOutline />,
                    label: t('sidebar.services'),
                    link: '/services',
                },
            ]
            : []),

        // withdrawal_requests
        ...(hasPermission('withdrawal-request.index')
            ? [
                {
                    id: crypto.randomUUID(),
                    icon: <FaWallet />,
                    label: t('sidebar.withdrawal_requests'),
                    link: '/withdrawal_requests/index',
                },
            ]
            : []),

        // bookings
        ...(hasPermission('booking.index') || hasPermission('rescheduled-booking.index')
            ? [
                {
                    heading: t('sidebar.bookings'),
                },

                ...(hasPermission('booking.index')
                    ? [
                        {
                            id: crypto.randomUUID(),
                            icon: <BiSolidReport />,
                            label: t('sidebar.bookings'),
                            link: '/bookings/index',
                        },
                    ]
                    : []),

                ...(hasPermission('rescheduled-booking.index')
                    ? [
                        {
                            id: crypto.randomUUID(),
                            icon: <BiSolidReport />,
                            label: t('sidebar.rescheduled_bookings'),
                            link: '/rescheduled-bookings/index',
                        },
                    ]
                    : []),
            ]
            : []),

        // categories
        ...(hasPermission('category.index') ||
            hasPermission('category.store') ||
            hasPermission('subcategory.index') ||
            hasPermission('subcategory.store')
            ? [
                {
                    heading: t('sidebar.categories'),
                },

                ...(hasPermission('category.index') || hasPermission('category.store')
                    ? [
                        {
                            id: crypto.randomUUID(),
                            icon: <FaLayerGroup />,
                            label: t('sidebar.categories'),
                            link: '/categories',
                            items: [
                                ...(hasPermission('category.index')
                                    ? [
                                        {
                                            id: crypto.randomUUID(),
                                            icon: <PageIcon />,
                                            label: t('breadcrumb.categories.all'),
                                            link: '/categories/index',
                                        },
                                    ]
                                    : []),
                                ...(hasPermission('category.store')
                                    ? [
                                        {
                                            id: crypto.randomUUID(),
                                            icon: <PageIcon />,
                                            label: t('breadcrumb.categories.add'),
                                            link: '/categories/add',
                                        },
                                    ]
                                    : []),
                            ],
                        },
                    ]
                    : []),

                ...(hasPermission('subcategory.index') || hasPermission('subcategory.store')
                    ? [
                        {
                            id: crypto.randomUUID(),
                            icon: <FaLayerGroup />,
                            label: t('sidebar.sub_categories'),
                            link: '/sub-categories',
                            items: [
                                ...(hasPermission('subcategory.index')
                                    ? [
                                        {
                                            id: crypto.randomUUID(),
                                            icon: <PageIcon />,
                                            label: t('breadcrumb.sub_categories.all'),
                                            link: '/sub-categories/index',
                                        },
                                    ]
                                    : []),

                                ...(hasPermission('subcategory.store')
                                    ? [
                                        {
                                            id: crypto.randomUUID(),
                                            icon: <PageIcon />,
                                            label: t('breadcrumb.sub_categories.add'),
                                            link: '/sub-categories/add',
                                        },
                                    ]
                                    : []),
                            ],
                        },
                    ]
                    : []),
            ]
            : []),

        // providers
        ...(hasPermission('provider.index') || hasPermission('provider-request.index')
            ? [
                {
                    heading: t('sidebar.providers'),
                },
                ...(hasPermission('provider-request.index')
                    ? [
                        {
                            id: crypto.randomUUID(),
                            icon: <IoSettingsOutline />,
                            label: t('sidebar.provider_requests'),
                            link: '/provider-requests',
                        },
                    ]
                    : []),

                ...(hasPermission('provider.index')
                    ? [
                        {
                            id: crypto.randomUUID(),
                            icon: <FaUsers />,
                            label: t('sidebar.providers'),
                            link: '/providers/index',
                        },
                    ]
                    : []),
            ]
            : []),

        // clients
        ...(hasPermission('client.index')
            ? [
                {
                    heading: t('sidebar.clients'),
                },

                {
                    id: crypto.randomUUID(),
                    icon: <FaUsers />,
                    label: t('sidebar.clients'),
                    link: '/clients/index',
                },
            ]
            : []),

        // roles_permissions
        ...(hasPermission('admin.index') ||
            hasPermission('admin.store') ||
            hasPermission('role.index') ||
            hasPermission('role.store')
            ? [
                {
                    heading: t('sidebar.users_settings'),
                },

                ...(hasPermission('admin.index') || hasPermission('admin.store')
                    ? [
                        {
                            id: crypto.randomUUID(),
                            icon: <MdAdminPanelSettings />,
                            label: t('sidebar.admins'),
                            link: '/admins',
                            items: [
                                ...(hasPermission('admin.index')
                                    ? [
                                        {
                                            id: crypto.randomUUID(),
                                            icon: <PageIcon />,
                                            label: t('breadcrumb.admins.all'),
                                            link: '/admins/index',
                                        },
                                    ]
                                    : []),
                                ...(hasPermission('admin.store')
                                    ? [
                                        {
                                            id: crypto.randomUUID(),
                                            icon: <PageIcon />,
                                            label: t('breadcrumb.admins.add'),
                                            link: '/admins/add',
                                        },
                                    ]
                                    : []),
                            ],
                        },
                    ]
                    : []),

                ...(hasPermission('role.index') || hasPermission('role.store')
                    ? [
                        {
                            id: crypto.randomUUID(),
                            icon: <IconPasswordUser />,
                            label: t('sidebar.roles'),
                            link: '/roles',
                            items: [
                                ...(hasPermission('role.index')
                                    ? [
                                        {
                                            id: crypto.randomUUID(),
                                            icon: <PageIcon />,
                                            label: t('breadcrumb.roles.all'),
                                            link: '/roles/index',
                                        },
                                    ]
                                    : []),

                                ...(hasPermission('role.store')
                                    ? [
                                        {
                                            id: crypto.randomUUID(),
                                            icon: <PageIcon />,
                                            label: t('breadcrumb.roles.add'),
                                            link: '/roles/add',
                                        },
                                    ]
                                    : []),
                            ],
                        },
                    ]
                    : []),
            ]
            : []),


        // public_pages
        ...(hasPermission('about.index') ||
            hasPermission('faq.index') ||
            hasPermission('policy.index') ||
            hasPermission('term.index') ||
            hasPermission('cancellation-policy.index')
            ? [
                {
                    heading: t('sidebar.public_pages'),
                },

                ...(hasPermission('about.index')
                    ? [
                        {
                            id: crypto.randomUUID(),
                            icon: <IoSettingsOutline />,
                            label: t('sidebar.about'),
                            link: '/why-us',
                        },
                    ]
                    : []),
                ...(hasPermission('sections.index')
                    ? [
                        {
                            id: crypto.randomUUID(),
                            icon: <IoSettingsOutline />,
                            label: t('sidebar.sections'),
                            link: '/sections',
                        },
                    ]
                    : []),

                ...(hasPermission('faq.index')
                    ? [
                        {
                            id: crypto.randomUUID(),
                            icon: <IoSettingsOutline />,
                            label: t('sidebar.faqs'),
                            link: '/faq/index',
                        },
                    ]
                    : []),

                ...(hasPermission('policy.index')
                    ? [
                        {
                            id: crypto.randomUUID(),
                            icon: <IoSettingsOutline />,
                            label: t('sidebar.privacy_policy'),
                            link: '/privacy-policy',
                        },
                    ]
                    : []),

                ...(hasPermission('term.index')
                    ? [
                        {
                            id: crypto.randomUUID(),
                            icon: <IoSettingsOutline />,
                            label: t('sidebar.terms'),
                            link: '/terms',
                        },
                    ]
                    : []),

                ...(hasPermission('cancellation-policy.index')
                    ? [
                        {
                            id: crypto.randomUUID(),
                            icon: <IoSettingsOutline />,
                            label: t('sidebar.cancellation_policy'),
                            link: '/cancellation-policy',
                        },
                    ]
                    : []),
            ]
            : []),

        // Settings
        ...(hasPermission('setting.index') || hasPermission('contact-us.index')
            ? [
                {
                    heading: t('sidebar.mainSettings'),
                },
                // contact_messages
                ...(hasPermission('contact-us.index')
                    ? [
                        {
                            id: crypto.randomUUID(),
                            icon: <MdMessage />,
                            label: t('sidebar.contact_messages'),
                            link: '/contact-messages',
                        },
                    ]
                    : []),

                // Settings
                ...(hasPermission('setting.index')
                    ? [
                        {
                            id: crypto.randomUUID(),
                            icon: <IoSettingsOutline />,
                            label: t('sidebar.mainSettings'),
                            link: '/settings',
                        },
                    ]
                    : []),
            ]
            : []),
    ];

    return sideBarItems;
};
