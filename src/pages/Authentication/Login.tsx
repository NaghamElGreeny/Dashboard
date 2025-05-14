import { useQueryClient } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import { useContext, useEffect, useTransition } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { AuthContext } from '../../Auth/AuthProvider';
import InputCustom from '../../components/atoms/InputCustom';
import { useMutate } from '../../hooks/UseMutate';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import logo from '/assets/images/logo.png';
import { useTranslation } from 'react-i18next';
import DropDownLang from '../../components/molecules/DropDownLang';
import { BaseInputField } from '../../components/atoms/BaseInputField';
import { Button } from '../../components/atoms';

const Login = () => {
    const { t, i18n } = useTranslation();
    const { login, user, logout } = useContext(AuthContext);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Login'));

        const language = localStorage.getItem('i18nextLng');

        const languagePrefix = language ? language.split('-')[0] : null;

        if (!languagePrefix || (languagePrefix !== 'en' && languagePrefix !== 'ar')) {
            localStorage.setItem('i18nextLng', 'ar');
        } else if (languagePrefix === 'en' && language !== 'en') {
            localStorage.setItem('i18nextLng', 'ar');
        }
    }, [dispatch]);

    const isToken = localStorage.getItem('token');
    const navigate = useNavigate();
    const isDark =
        useSelector((state: IRootState) => state.themeConfig.theme) === 'dark' ? true : false;

    const initialValues = {
        email: '',
        password: '',
    };

    const validationSchema = () =>
        Yup.object({
            email: Yup.string()
                .email(t('validations.email', { field: t('labels.email') }))
                .required(t('requiredField', { field: t('labels.email') })),

            password: Yup.string().required(t('requiredField', { field: t('labels.password') })),
        });

    const queryClient = useQueryClient();
    // // post data
    const { mutate, isLoading } = useMutate({
        mutationKey: ['auth/login'],
        endpoint: `auth/login`,
        onSuccess: (data: any) => {
            //  localStorage.setItem('token',`${data.data.access_token}`)
            localStorage.setItem(
                'permissions',
                JSON.stringify(data?.data?.data?.role?.permissions || [])
            );
            login(data?.data?.data?.token);
            user(data?.data?.data);

            window.location.replace('/');

            // navigate('/');
            // location.replace('/');
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title: data?.data?.message || t('loginSuccessfully'),
            });
        },
        onError: (err: any) => {
            if (err.response && err.response.status === 401) {
                logout();
                window.location.replace('/login');
            }

            ShowAlertMixin({
                type: 15,
                icon: 'error',
                title: err?.response?.data?.message,
            });
        },
        formData: true,
    });

    if (!isToken) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-cover bg-center bg-[url('/assets/images/map.svg')] dark:bg-[url('/assets/images/map-dark.svg')]">
                <div className="panel sm:w-[480px] m-6 max-w-lg w-full">
                    <div className="flex flex-wrap justify-between mb-4">
                        <img src={logo} alt="logo" className="w-8 h-8 rounded-full object-contain" />
                        <div>
                            <DropDownLang />
                        </div>
                    </div>
                    <h2 className="text-start text-lg font-semibold">{t('welcome')}</h2>
                    <p className="mb-7 text-start text-lg font-semibold">{t('sign_in')}</p>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema()}
                        onSubmit={(values: any) => {
                            mutate({ ...values });
                        }}
                    >
                        {({ validateForm }) => {
                            // Listen for language changes and revalidate
                            useEffect(() => {
                                validateForm();
                            }, [i18n.language]);

                            return (
                                <Form>
                                    <div className="grid lg:grid-cols-12 max-sm:grid-cols-1 gap-5 ">
                                        <div className="lg:col-span-12 max-sm:col-span-1 ">
                                            {/* <label htmlFor="login">{t('labels.email')}</label>
                                    <InputCustom type="text" name="email" /> */}

                                            <BaseInputField
                                                label={t('labels.email')}
                                                name="email"
                                                id="email"
                                                type="email"
                                                className="border"
                                                placeholder={t('enter') + ' ' + t('labels.email')}
                                            />
                                        </div>
                                        <div className="lg:col-span-12 max-sm:col-span-1 ">
                                            {/* <label htmlFor="password">{t('labels.password')}</label>
                                    <InputCustom type="password" name="password" /> */}
                                            <BaseInputField
                                                label={t('labels.password')}
                                                name="password"
                                                id="password"
                                                type="password"
                                                placeholder={
                                                    t('enter') + ' ' + t('labels.password')
                                                }
                                            />
                                        </div>

                                        <div className="lg:col-span-12 max-sm:col-span-1 ">
                                            <Button
                                                type="submit"
                                                className="btn btn-primary w-full"
                                                loading={isLoading}
                                            >
                                                {t('buttons.login')}
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        );
    }
    //  else {
    //     location.replace('/');
    // }
};

export default Login;
