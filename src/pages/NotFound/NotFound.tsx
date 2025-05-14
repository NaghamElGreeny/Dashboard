import React from 'react';
import logo from '/assets/images/logo.png';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center">
            <img src={logo} alt="logo" className="w-90 h-90 mb-6" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                404
            </h1>

            <p className="text-2xl font-medium text-gray-800 mt-4">{t('page_notFound')}</p>
            <p className="text-xl text-gray-500 mt-2 font-medium">{t('wrong_page')}</p>
            <Link to="/" className="text-blue-500 border-b border-blue-500 mt-4 text-xl">
                {t('go_home')}
            </Link>
        </div>
    );
}
