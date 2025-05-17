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
            hasPermission('policy.index') ||
            hasPermission('term.index') ||
            hasPermission('cancellation-policy.index') ||
            hasPermission('sections.index')
            ? [
                {
                    heading: t('sidebar.public_pages'),
                },

                ...(hasPermission('why-us.index')
                    ? [
                        {
                            id: crypto.randomUUID(),
                            icon: <IoSettingsOutline />,
                            label: t('sidebar.about'),
                            link: '/why-us/index',
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
                ...(hasPermission('social.index')
                    ? [
                        {
                            id: crypto.randomUUID(),
                            icon: <IoSettingsOutline />,
                            label: t('sidebar.socials'),
                            link: '/socials',
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
