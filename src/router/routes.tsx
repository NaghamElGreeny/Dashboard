//@ts-nocheck
import { lazy } from 'react';

import ChangePassword from '../components/template/Profile/ChangePassword';
import UpdateProfile from '../components/template/Profile/UpdateProfile';
import Login from '../pages/Authentication/Login';
import ProfilePage from '../pages/Profile/Profile';

import AddCountry from '../components/template/Countries/AddCountry';
import UpdateCountry from '../components/template/Countries/UpdateCountry';
import CountriesPage from '../pages/Countries/Countries';

import AddCity from '../components/template/Cities/AddCity';
import UpdateCity from '../components/template/Cities/UpdateCity';
import CitiesPage from '../pages/Cities/Cities';

import AddDistrict from '../components/template/Districts/AddDistrict';
import UpdateDistrict from '../components/template/Districts/UpdateDistrict';
import DistrictsPage from '../pages/Districts/Districts';

import AddCategory from '../components/template/Categories/AddCategory';
import UpdateCategory from '../components/template/Categories/UpdateCategory';
import CategoriesPage from '../pages/Categories/Categories';

import AddSubCategory from '../components/template/SubCategories/AddSubCategory';
import UpdateSubCategory from '../components/template/SubCategories/UpdateSubCategory';
import SubCategoriesPage from '../pages/SubCategories/SubCategories';

import AddCancelReason from '../components/template/CancelReasons/AddCancelReason';
import UpdateCancelReason from '../components/template/CancelReasons/UpdateCancelReason';
import CancelReasonsPage from '../pages/CancelReasons/CancelReasons';

import AddAccountDeletionReason from '../components/template/AccountDeletionReasons/AddAccountDeletionReason';
import UpdateAccountDeletionReason from '../components/template/AccountDeletionReasons/UpdateAccountDeletionReason';
import AccountDeletionReasonsPage from '../pages/AccountDeletionReasons/AccountDeletionReasons';

import AddReportReason from '../components/template/ReportReasons/AddReportReason';
import UpdateReportReason from '../components/template/ReportReasons/UpdateReportReason';
import ReportReasonsPage from '../pages/ReportReasons/ReportReasons';

import AddSpecialtyCase from '../components/template/SpecialtyCases/AddSpecialtyCase';
import UpdateSpecialtyCase from '../components/template/SpecialtyCases/UpdateSpecialtyCase';
import SpecialtyCasesPage from '../pages/SpecialtyCases/SpecialtyCases';

import AddLanguage from '../components/template/Languages/AddLanguage';
import UpdateLanguage from '../components/template/Languages/UpdateLanguage';
import LanguagesPage from '../pages/Languages/Languages';

import AddSlider from '../components/template/Sliders/AddSlider';
import UpdateSlider from '../components/template/Sliders/UpdateSlider';
import SlidersPage from '../pages/Sliders/Sliders';

import AddCoupon from '../components/template/Coupons/AddCoupon';
import UpdateCoupon from '../components/template/Coupons/UpdateCoupon';
import CouponsPage from '../pages/Coupons/Coupons';

import AddCourseCategory from '../components/template/CourseCategory/AddCourseCategory';
import UpdateCourseCategory from '../components/template/CourseCategory/UpdateCourseCategory';
import CourseCategoryPage from '../pages/CourseCategory/CourseCategory';

import AddCourse from '../components/template/Courses/AddCourse';
import UpdateCourse from '../components/template/Courses/UpdateCourse';
import ShowCourse from '../components/template/Courses/ShowCourse';
import CoursesPage from '../pages/Courses/Courses';

// import AddArticle from '../components/template/Articles/AddArticle';
// import UpdateArticle from '../components/template/Articles/UpdateArticle';
// import ArticlesPage from '../pages/Articles/Articles';

import AddFaq from '../components/template/Faqs/AddFaq';
import UpdateFaq from '../components/template/Faqs/UpdateFaq';
import FaqsPage from '../pages/Faqs/Faqs';

import ProviderRequestsPage from '../pages/ProviderRequests/ProviderRequests';

import ShowProvider from '../components/template/Providers/ShowProvider';
import UpdateProvider from '../components/template/Providers/UpdateProvider';
import ProvidersPage from '../pages/Providers/Providers';

import ShowClient from '../components/template/Clients/ShowClient';
import ClientsPage from '../pages/Clients/Clients';

import ReportsPage from '../pages/Reports/Reports';

import BookingsPage from '../pages/Bookings/Bookings';
import ShowBooking from '../components/template/Bookings/ShowBooking';
import RescheduledBookingsPage from '../pages/RescheduledBookings/RescheduledBookings';

import WithdrawalRequestsPage from '../pages/WithdrawalRequests/WithdrawalRequests';

import ServicesPage from '../components/template/Services/UpdateService';
import AboutUsPage from '../components/template/About/UpdateAbout';
import SectionsPage from '../components/template/Sections/UpdateSections';

import PolicyPage from '../components/template/PrivacyPolicy/UpdatePrivacyPolicy';
import TermsPage from '../components/template/Terms/UpdateTerm';
import CancellationPolicyPage from '../components/template/CancellationPolicy/UpdateCancellationPolicy';

import AddNotification from '../components/template/Notifications/AddNotification';
import NotificationsPage from '../pages/Notifications/Notifications';

import FinancialReportsPage from '../pages/FinancialReports/FinancialReports';

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
        path: '/categories/index',
        element: hasPermission('category.index') ? (
            <CategoriesPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/categories/add',
        element: hasPermission('category.store') ? (
            <AddCategory />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/categories/edit/:id',
        element: hasPermission('category.update') ? (
            <UpdateCategory />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/sub-categories/index',
        element: hasPermission('subcategory.index') ? (
            <SubCategoriesPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/sub-categories/add',
        element: hasPermission('subcategory.store') ? (
            <AddSubCategory />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/sub-categories/edit/:id',
        element: hasPermission('subcategory.update') ? (
            <UpdateSubCategory />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/cancel-reasons/index',
        element: hasPermission('cancel-reason.index') ? (
            <CancelReasonsPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/cancel-reasons/add',
        element: hasPermission('cancel-reason.store') ? (
            <AddCancelReason />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/cancel-reasons/edit/:id',
        element: hasPermission('cancel-reason.update') ? (
            <UpdateCancelReason />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/account-deletion-reasons/index',
        element: hasPermission('account-deletion-reason.index') ? (
            <AccountDeletionReasonsPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/account-deletion-reasons/add',
        element: hasPermission('account-deletion-reason.store') ? (
            <AddAccountDeletionReason />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/account-deletion-reasons/edit/:id',
        element: hasPermission('account-deletion-reason.update') ? (
            <UpdateAccountDeletionReason />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/report-reasons/index',
        element: hasPermission('report-reason.index') ? (
            <ReportReasonsPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/report-reasons/add',
        element: hasPermission('report-reason.store') ? (
            <AddReportReason />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/report-reasons/edit/:id',
        element: hasPermission('report-reason.update') ? (
            <UpdateReportReason />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/specialty-cases/index',
        element: hasPermission('speciality-case.index') ? (
            <SpecialtyCasesPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/specialty-cases/add',
        element: hasPermission('speciality-case.store') ? (
            <AddSpecialtyCase />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/specialty-cases/edit/:id',
        element: hasPermission('speciality-case.update') ? (
            <UpdateSpecialtyCase />
        ) : (
            <Navigate to="/permission-required" />
        ),
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
        path: '/sliders/index',
        element: hasPermission('slider.index') ? (
            <SlidersPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/sliders/add',
        element: hasPermission('slider.store') ? (
            <AddSlider />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/sliders/edit/:id',
        element: hasPermission('slider.update') ? (
            <UpdateSlider />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/coupons/index',
        element: hasPermission('coupon.index') ? (
            <CouponsPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/coupons/add',
        element: hasPermission('coupon.store') ? (
            <AddCoupon />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/coupons/edit/:id',
        element: hasPermission('coupon.update') ? (
            <UpdateCoupon />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/course-category/index',
        element: hasPermission('course-category.index') ? (
            <CourseCategoryPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/course-category/add',
        element: hasPermission('course-category.store') ? (
            <AddCourseCategory />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/course-category/edit/:id',
        element: hasPermission('course-category.update') ? (
            <UpdateCourseCategory />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/courses/index',
        element: hasPermission('course.index') ? (
            <CoursesPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/courses/add',
        element: hasPermission('course.store') ? (
            <AddCourse />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/courses/edit/:id',
        element: hasPermission('course.update') ? (
            <UpdateCourse />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/courses/show/:id',
        element: hasPermission('course.show') ? (
            <ShowCourse />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    // {
    //     path: '/articles/index',
    //     element: hasPermission('article.index') ? (
    //         <ArticlesPage />
    //     ) : (
    //         <Navigate to="/permission-required" />
    //     ),
    // },

    // {
    //     path: '/articles/add',
    //     element: hasPermission('article.store') ? (
    //         <AddArticle />
    //     ) : (
    //         <Navigate to="/permission-required" />
    //     ),
    // },

    // {
    //     path: '/articles/edit/:id',
    //     element: hasPermission('article.update') ? (
    //         <UpdateArticle />
    //     ) : (
    //         <Navigate to="/permission-required" />
    //     ),
    // },

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
        path: '/provider-requests',
        element: hasPermission('provider-request.index') ? (
            <ProviderRequestsPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/providers/index',
        element: hasPermission('provider.index') ? (
            <ProvidersPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/providers/show/:id',
        element: hasPermission('provider.show') ? (
            <ShowProvider />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/providers/edit/:id',
        element: hasPermission('provider.update') ? (
            <UpdateProvider />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/clients/index',
        element: hasPermission('client.index') ? (
            <ClientsPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/clients/show/:id',
        element: hasPermission('client.show') ? (
            <ShowClient />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    {
        path: '/reports/index',
        element: hasPermission('report.index') ? (
            <ReportsPage />
        ) : (
            <Navigate to="/permission-required" />
        ),
    },

    // {
    //     path: '/financial-reports',
    //     element: hasPermission('financial-reports.index') ? (
    //         <FinancialReportsPage />
    //     ) : (
    //         <Navigate to="/permission-required" />
    //     ),
    // },

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
        path: '/withdrawal_requests/index',
        element: hasPermission('withdrawal-request.index') ? (
            <WithdrawalRequestsPage />
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
    //     path: '/notifications/index',
    //     element: <NotificationsPage />,
    // },

    {
        path: '/notifications/add',
        element: <AddNotification />,
    },

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
