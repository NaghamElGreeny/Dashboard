import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useContext } from 'react';
import { AuthContext } from '../Auth/AuthProvider';
import { useIsRTL } from './useIsRTL';
import ShowAlertMixin from '../components/atoms/ShowAlertMixin';
import { useTranslation } from 'react-i18next';

type useMutateProps_TP<response_T> = {
    endpoint: string;
    mutationKey: [string];
    onSuccess?: (data: response_T) => void;
    onError?: (err: unknown) => void;
    formData?: boolean;
    onMutate?: (err?: unknown) => void;
    method?: 'post' | 'delete'; // Add the method property
    headers?: Record<string, string>; // Add headers property
    general?: boolean;
};

export function useMutate<response_T>({
    general,
    endpoint,
    mutationKey,
    onError: originalOnError,
    onSuccess,
    formData,
    onMutate,
    method = 'post', // Set a default value for the method
    headers = {}, // Default headers to an empty object
}: useMutateProps_TP<response_T>) {
    const { logout } = useContext(AuthContext);
    const { t } = useTranslation();

    const user_token = Cookies.get('token') || localStorage.getItem('token');
    const token = user_token;
    const authorizationHeader = `Bearer ${token}`;
    const baseURL = import.meta.env.VITE_BASE_URL;
    const baseURLGeneral = import.meta.env.VITE_BASE_GENERAL_URL;

    const enhancedOnError = (err: any) => {
        /* if (err.response?.status === 401) {
            ShowAlertMixin({
                type: 15,
                icon: 'error',
                title: t('session_expired'),
            });
            logout();
            window.location.replace('/login');
        } */
        if (originalOnError) originalOnError(err);
    };
    const isRTL = useIsRTL();

    const { data, isLoading, isSuccess, mutate, failureReason, isError } = useMutation({
        mutationKey,
        mutationFn: (values) => {
            const requestConfig = {
                method: method.toUpperCase(), // Use the specified method
                url: `${general ? baseURLGeneral : baseURL}/${endpoint}`,
                data: values,
                headers: formData
                    ? {
                        ...headers, // Include additional headers
                        'Content-Type': 'multipart/form-data',
                        Accept: 'application/json',
                        Authorization: authorizationHeader,
                        'Accept-Language': isRTL ? 'ar' : 'en',
                    }
                    : {
                        'Content-Type': 'application/json; charset=utf-8',
                        Accept: 'application/json',
                        Authorization: authorizationHeader,
                        'Accept-Language': isRTL ? 'ar' : 'en',
                    },
            };

            return axios(requestConfig);
        },
        onSuccess,
        onError: enhancedOnError,
        onMutate,
    });
    return { data, isLoading, isSuccess, mutate, failureReason, isError };
}
