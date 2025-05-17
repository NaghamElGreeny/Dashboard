import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useContext } from 'react';
import { AuthContext } from '../Auth/AuthProvider';
import showAlert from '../components/atoms/ShowAlert';
import { useIsRTL } from './useIsRTL';
import { useTranslation } from 'react-i18next';
import ShowAlertMixin from '../components/atoms/ShowAlertMixin';

type useFetchPops_TP = {
    queryKey: [string];
    endpoint: string;
    enabled?: boolean;
    select?: ((data: any) => any) | undefined;
    onError?: (err: any) => void;
    onSuccess?: (err: any) => void;
    localization?: boolean;
    useCompanyToken?: boolean;
    specificToken?: string;
    general?: boolean;
};
function useFetch<T>({
    general,
    endpoint,
    enabled,
    select,
    queryKey,
    onError: originalOnError,
    onSuccess,
    localization,
    useCompanyToken,
    specificToken,
}: useFetchPops_TP) {
    const { t } = useTranslation();
    const { logout } = useContext(AuthContext);
    const user_token = Cookies.get('token') || localStorage.getItem('token');;
    const token = user_token;
    const authorizationHeader = `Bearer ${token}`;
    const baseURL = import.meta.env.VITE_BASE_URL;
    const baseURLGeneral = import.meta.env.VITE_BASE_GENERAL_URL;

    const isRTL = useIsRTL();

    const config = {
        headers: {
            Authorization: authorizationHeader,
            'Accept-Language': isRTL ? 'ar' : 'en',
        },
    };
    const query = useQuery<T>({
        queryKey: [...queryKey, isRTL],
        queryFn: () =>
            axios
                .get(`${general ? baseURLGeneral : baseURL}/${endpoint}`, config)
                .then((res: any) => res.data),

        enabled,
        select,
        onError: (err: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'error',
                title: err?.response?.data?.message ? err?.response?.data?.message : t('no_data'),
            });

            //@ts-ignore
            /* if (err.response?.status === 401) {
                // showAlert(t('session_expired'), '', false, t('ok'), true, 'success');
                ShowAlertMixin({
                    type: 15,
                    icon: 'error',
                    title: t('session_expired'),
                });
                logout();
                window.location.replace('/login');
            } */
            if (originalOnError) originalOnError(err);
        },
        onSuccess,
    });
    return query;
}

export default useFetch;
