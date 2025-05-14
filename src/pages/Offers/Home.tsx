import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import FlashSales from './FlashSales';
import Offers from './Offers';

export default function SettingsPage() {
    const { t } = useTranslation();
    const location = useLocation();

    // Define tabs with keys and labels
    const tabMap = [
        { key: 'offers', label: t('labels.offer') },
        { key: 'flash_sale', label: t('labels.flash_sale') },
    ];

    // Extract the current tab from the URL
    const currentTab = tabMap.find((tab) => location.search.includes(tab.key))?.key || 'offers';

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.offers.title') },
    ];

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />

            <div className="mt-3 flex flex-wrap bg-white py-3 px-4 mb-5">
                {tabMap.map((tab) => (
                    <Link
                        key={tab.key}
                        to={`?${tab.key}`}
                        className={`font-bold text-[16px] ${
                            currentTab === tab.key
                                ? 'text-secondary !outline-none before:!w-full'
                                : ''
                        } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-[80%]`}
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>

            <div>
                {currentTab === 'offers' && <Offers />}
                {currentTab === 'flash_sale' && <FlashSales />}
            </div>
        </>
    );
}
