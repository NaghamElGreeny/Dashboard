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

        // public_pages
        ...(hasPermission('whyus.index') ||
            hasPermission('faq.index') ||
            hasPermission('contact-info.index') ||
            hasPermission('policy.index') ||
            hasPermission('term.index') ||
            hasPermission('cancellation-policy.index') ||
            hasPermission('sections.index')
            ? [



                ...(hasPermission('sections.index') || hasPermission('sections.store')
                    ? [
                        {
                            id: crypto.randomUUID(),
                            icon: <MdOutlineImage />,
                            label: t('breadcrumb.sections.title'),
                            link: '/sections',
                            items: [
                                ...(hasPermission('sections.index')
                                    ? [
                                        {
                                            id: crypto.randomUUID(),
                                            icon: <PageIcon />,
                                            label: t('breadcrumb.sections.all'),
                                            link: '/sections/index',
                                        },
                                    ]
                                    : []),
                                ...(hasPermission('sections.store')
                                    ? [
                                        {
                                            id: crypto.randomUUID(),
                                            icon: <PageIcon />,
                                            label: t('breadcrumb.sections.add'),
                                            link: '/sections/add',
                                        },
                                    ]
                                    : []),
                            ],
                        },
                    ]
                    : []),
                ...(hasPermission('why-us.index') || hasPermission('why-us.store')
                    ? [
                        {
                            id: crypto.randomUUID(),
                            icon: <IoSettingsOutline />,
                            label: t('sidebar.about'),
                            link: '/why-us',
                            items: [
                                ...(hasPermission('why-us.index')
                                    ? [
                                        {
                                            id: crypto.randomUUID(),
                                            icon: <PageIcon />,
                                            label: t('breadcrumb.sections.all'),
                                            link: '/why-us/index',
                                        },
                                    ]
                                    : []),
                                ...(hasPermission('why-us.store')
                                    ? [
                                        {
                                            id: crypto.randomUUID(),
                                            icon: <PageIcon />,
                                            label: t('breadcrumb.sections.add'),
                                            link: '/why-us/add',
                                        },
                                    ]
                                    : []),
                            ],
                        },
                    ]
                    : []),
                ...(hasPermission('faq.index') || hasPermission('faq.store')
                    ? [
                        {
                            id: crypto.randomUUID(),
                            icon: <IoSettingsOutline />,
                            label: t('sidebar.faq'),
                            link: '/faq',
                            items: [
                                ...(hasPermission('report-reason.index')
                                    ? [
                                        {
                                            id: crypto.randomUUID(),
                                            icon: <PageIcon />,
                                            label: t('breadcrumb.sections.all'),
                                            link: '/faq/index',
                                        },
                                    ]
                                    : []),
                                ...(hasPermission('faq.store')
                                    ? [
                                        {
                                            id: crypto.randomUUID(),
                                            icon: <PageIcon />,
                                            label: t('breadcrumb.sections.add'),
                                            link: '/faq/add',
                                        },
                                    ]
                                    : []),
                            ],
                        },
                    ]
                    : []),


                ...(hasPermission('socials.index')
                    ? [
                        {
                            id: crypto.randomUUID(),
                            icon: <IoSettingsOutline />,
                            label: t('sidebar.socials'),
                            link: '/contact-info/index',
                        },
                    ]
                    : []),
                ...(hasPermission('features.index')
                    ? [
                        {
                            id: crypto.randomUUID(),
                            icon: <IoSettingsOutline />,
                            label: t('sidebar.features'),
                            link: '/our-features/index',
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


            ]
            : []),

        // Settings
        ...(hasPermission('setting.index')
            ? [
                {
                    heading: t('sidebar.mainSettings'),
                },

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
