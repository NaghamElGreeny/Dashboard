//@ts-nocheck
import { lazy } from 'react';

import ChangePassword from '../components/template/Profile/ChangePassword';
import UpdateProfile from '../components/template/Profile/UpdateProfile';
import Login from '../pages/Authentication/Login';
import ProfilePage from '../pages/Profile/Profile';

import AddSocial from '../components/template/Socials/AddSocial';
import UpdateSocial from '../components/template/Socials/UpdateSocial';
import SocialsPage from '../pages/Socials/Socials';

import AddFaq from '../components/template/Faqs/AddFaq';
import UpdateFaq from '../components/template/Faqs/UpdateFaq';
import FaqsPage from '../pages/Faqs/Faqs';

import WhyUsPage from '../pages/Whyus/Whyus';
import UpdateWhyus from '../components/template/WhyUs/UpdateWhyUs';

// import ServicesPage from '../components/template/Services/UpdateService';
// import SectionsPage from '../components/template/Sections/UpdateSections';
import SectionsPage from '../pages/Sections/Sections';
import AddSection from '../components/template/Sections/AddSection'
import UpdateSection from '../components/template/Sections/UpdateSection'

import BannersPage from '../pages/Banners/Banners';
import AddBanner from '../components/template/Banners/AddBanner'
import UpdateBanner from '../components/template/Banners/UpdateBanner'

import PolicyPage from '../components/template/PrivacyPolicy/UpdatePrivacyPolicy';
import TermsPage from '../components/template/Terms/UpdateTerm';

import { hasPermission } from '../helper/permissionHelpers';

import SettingsPage from '../pages/Settings/Home';

import { Navigate } from 'react-router-dom';
import WhyUsEdit from '../components/template/WhyUs/WhyUsEdit';
import AddWhyus from '../components/template/WhyUs/AddWhyus';

import ServicesPage from '../pages/Services/Services'
import UpdateService from '../components/template/Services/UpdateService.tsx';
import AddService from '../components/template/Services/AddService';
import UpdateSections from '../components/template/Sections/UpdateSection';

import StaticPages from '../pages/StaticPages/StaticPages'
import AddStaticPage from '../components/template/StaticPages/AddPage';
import UpdateStaticPage from '../components/template/StaticPages/UpdatePage';

const Index = lazy(() => import('../pages/Index'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));
const PermissionRequired = lazy(() => import('../pages/PermissionRequired/PermissionRequired'));

const LoginBoxed = lazy(() => import('../pages/Authentication/Login'));

const routes = [
    {
        path: '/',
        element: <Index />,
    },

    {
        path: '/login',
        element: <Login />,
    },

    {
        path: '/profile',
        element: <ProfilePage />,
    },

    {
        path: '/profile/edit',
        element: <UpdateProfile />,
    },

    {
        path: '/profile/change-password',
        element: <ChangePassword />,
    },

    {
        path: 'static-pages/index',
        element: hasPermission('static-pages.index') ? <StaticPages /> : <Navigate to="/permission-required" />,
    },
    {
        path: '/static-pages/add',
        element: hasPermission('static-pages.store') ? <AddStaticPage /> : <Navigate to="/permission-required" />,
    },

    {
        path: '/static-pages/edit/:id',
        element: hasPermission('static-pages.update') ? (<UpdateStaticPage />) : (<Navigate to="/permission-required" />),
    },
    {
        path: '/faq/index',
        element: hasPermission('faq.index') ? <FaqsPage /> : <Navigate to="/permission-required" />,
    },

    {
        path: '/faq/add',
        element: hasPermission('faq.store') ? <AddFaq /> : <Navigate to="/permission-required" />,
    },

    {
        path: '/faq/edit/:id',
        element: hasPermission('faq.update') ? (
            <UpdateFaq />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },
    // {
    //     path: '/contact-info/index',
    //     element: hasPermission('socials.index') ? <ContactUs /> : <Navigate to="/permission-required" />,
    // },

    // {
    //     path: '/contact-info/add',
    //     element: hasPermission('socials.store') ? <AddSocial /> : <Navigate to="/permission-required" />,
    // },

    {
        path: '/contact-info/edit/:id',
        element: hasPermission('socials.update') ? (
            <UpdateSocial />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },
    {
        path: '/our-features/index',
        element: hasPermission('serivces.index') ? <ServicesPage /> : <Navigate to="/permission-required" />,
    },

    {
        path: '/our-features/add',
        element: hasPermission('services.store') ? <AddService /> : <Navigate to="/permission-required" />,
    },

    {
        path: '/our-features/edit/:id',
        element: hasPermission('services.update') ? <UpdateService /> : <Navigate to="/permission-required" />,
    },
    {
        path: '/why-us/add',
        element: hasPermission('why-us.store') ? <AddWhyus /> : <Navigate to="/permission-required" />,
    },
    {
        path: '/why-us/index',
        element: hasPermission('why-us.index') ? <WhyUsPage /> : <Navigate to="/permission-required" />,
    },

    {
        path: '/why-us/edit/:id',
        element: hasPermission('whyus.update') ? (
            <UpdateWhyus />
            // <WhyUsEdit />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },


    {
        path: '/sections/index',
        element: hasPermission('sections.index') ? (
            <SectionsPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },
    {
        path: '/sections/edit/:id',
        element: hasPermission('sections.update') ? (
            <UpdateSection />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },
    {
        path: '/sections/add',
        element: hasPermission('sections.store') ? <AddSection /> : <Navigate to="/permission-required" />,
    },
    {
        path: '/banners/index',
        element: hasPermission('banners.index') ? (
            <BannersPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },
    {
        path: '/banners/edit/:id',
        element: hasPermission('banners.update') ? (
            <UpdateBanner />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },
    {
        path: '/banners/add',
        element: hasPermission('banners.store') ? <AddBanner /> : <Navigate to="/permission-required" />,
    },

    {
        path: '/services',
        element: hasPermission('service.index') ? (
            <ServicesPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/privacy-policy',
        element: hasPermission('policy.index') ? (
            <PolicyPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/terms',
        element: hasPermission('term.index') ? (
            <TermsPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },


    {
        path: '/settings',
        element: hasPermission('setting.index') ? (
            <SettingsPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    // Catch-all route for 404 Not Found page
    {
        path: '*',
        element: <NotFound />,
    },

    // route for permission page
    {
        path: '/permission-required',
        element: <PermissionRequired />,
    },
];

export { routes };
