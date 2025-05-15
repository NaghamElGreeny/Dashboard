//@ts-nocheck
import { lazy } from 'react';

import ChangePassword from '../components/template/Profile/ChangePassword';
import UpdateProfile from '../components/template/Profile/UpdateProfile';
import Login from '../pages/Authentication/Login';
import ProfilePage from '../pages/Profile/Profile';

import AddLanguage from '../components/template/Languages/AddLanguage';
import UpdateLanguage from '../components/template/Languages/UpdateLanguage';
import LanguagesPage from '../pages/Languages/Languages';

import AddFaq from '../components/template/Faqs/AddFaq';
import UpdateFaq from '../components/template/Faqs/UpdateFaq';
import FaqsPage from '../pages/Faqs/Faqs';



import ReportsPage from '../pages/Reports/Reports';

import BookingsPage from '../pages/Bookings/Bookings';
import ShowBooking from '../components/template/Bookings/ShowBooking';
import RescheduledBookingsPage from '../pages/RescheduledBookings/RescheduledBookings';

import ServicesPage from '../components/template/Services/UpdateService';
import AboutUsPage from '../components/template/About/UpdateAbout';
import SectionsPage from '../components/template/Sections/UpdateSections';

import PolicyPage from '../components/template/PrivacyPolicy/UpdatePrivacyPolicy';
import TermsPage from '../components/template/Terms/UpdateTerm';
import CancellationPolicyPage from '../components/template/CancellationPolicy/UpdateCancellationPolicy';

// import AddNotification from '../components/template/Notifications/AddNotification';
// import NotificationsPage from '../pages/Notifications/Notifications';

import AddAdmin from '../components/template/Admins/AddAdmin';
import UpdateAdmin from '../components/template/Admins/UpdateAdmin';
import AdminsPage from '../pages/Admins/Admins';

import { RolesForm } from '../components/template/Role/RolesForm';
import RolesPage from '../pages/Role/Role';

import { hasPermission } from '../helper/permissionHelpers';

import ContactMessagesPage from '../pages/ContactMessages/ContactMessages';
import SettingsPage from '../pages/Settings/Home';

import { Navigate } from 'react-router-dom';

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
        path: '/languages/index',
        element: hasPermission('language.index') ? (
            <LanguagesPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/languages/add',
        element: hasPermission('language.store') ? (
            <AddLanguage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/languages/edit/:id',
        element: hasPermission('language.update') ? (
            <UpdateLanguage />
        ) : (
            <Navigate to="/permission-required" />
        ),
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

    {
        path: '/why-us',
        element: hasPermission('about.index') ? (
            <AboutUsPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },
    {
        path: '/sections',
        element: hasPermission('about.index') ? (
            <SectionsPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
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
        path: '/rescheduled-bookings/index',
        element: hasPermission('rescheduled-booking.index') ? (
            <RescheduledBookingsPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/bookings/index',
        element: hasPermission('booking.index') ? (
            <BookingsPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/bookings/show/:id',
        element: hasPermission('booking.show') ? (
            <ShowBooking />
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
        path: '/cancellation-policy',
        element: hasPermission('cancellation-policy.index') ? (
            <CancellationPolicyPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    // {
    //     path: '/notifications/add',
    //     element: <AddNotification />,
    // },

    {
        path: '/admins/index',
        element: hasPermission('admin.index') ? (
            <AdminsPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/admins/add',
        element: hasPermission('admin.store') ? (
            <AddAdmin />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/admins/edit/:id',
        element: hasPermission('admin.update') ? (
            <UpdateAdmin />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/roles/index',
        element: hasPermission('role.index') ? (
            <RolesPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/roles/add',
        element: hasPermission('role.store') ? (
            <RolesForm />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/roles/edit/:id',
        element: hasPermission('role.update') ? (
            <RolesForm />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/contact-messages',
        element: hasPermission('contact-us.index') ? (
            <ContactMessagesPage />
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
