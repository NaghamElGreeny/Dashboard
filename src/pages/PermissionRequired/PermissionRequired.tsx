import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import permission from '/assets/images/permission.jpg';

export default function PermissionRequired() {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center">
            <img src={permission} alt="permission" className="w-100 h-100 mb-6" />

            <p className="text-2xl font-medium text-gray-800 mt-4">{t('not_allowed')}</p>
            <p className="text-xl text-gray-500 mt-2 font-medium">{t('not_allowed_page')}</p>
            <Link to="/" className="text-blue-500 border-b border-blue-500 mt-4 text-xl">
                {t('go_home')}
            </Link>
        </div>
    );
}
