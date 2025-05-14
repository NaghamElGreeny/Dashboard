import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import Offers from './Offers';
import FlashSales from './FlashSales';

export default function HomeCopy() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Map of tab indexes to URL keys
    const tabMap = ['offers', 'flash_sale'];

    // Determine the current tab from the URL or default to the first tab
    const currentTab = tabMap.indexOf([...searchParams.keys()][0]);
    const selectedIndex = currentTab !== -1 ? currentTab : 0;

    // Function to handle tab change and update the URL without '='
    const handleTabChange = (index: any) => {
        navigate(`?${tabMap[index]}`, { replace: true });
    };

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.offers.title') },
    ];

    const renderModals = () => (
        <>
            <Breadcrumb items={breadcrumbItems} />

            <Tab.Group selectedIndex={selectedIndex} onChange={handleTabChange}>
                <Tab.List className="mt-3 flex flex-wrap bg-white py-3 px-4 mb-5">
                    {tabMap.map((tab, index) => (
                        <Tab as={Fragment} key={index}>
                            {({ selected }) => (
                                <button
                                    className={`font-bold text-[16px] ${
                                        selected
                                            ? 'text-secondary !outline-none before:!w-full'
                                            : ''
                                    } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-[80%]`}
                                >
                                    {t(`labels.${tab}`)}
                                </button>
                            )}
                        </Tab>
                    ))}
                </Tab.List>
                <Tab.Panels>
                    <Tab.Panel>
                        <Offers />
                    </Tab.Panel>
                </Tab.Panels>
                <Tab.Panels>
                    <Tab.Panel>
                        <FlashSales />
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </>
    );

    return renderModals();
}
