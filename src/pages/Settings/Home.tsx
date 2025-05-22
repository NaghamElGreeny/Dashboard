import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import General from './General';
import Social from './Social';

export default function SettingsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Map of tab indexes to URL keys
    const tabMap = ['social', 'general'];

    // Determine the current tab from the URL or default to the first tab
    const currentTab = tabMap.indexOf([...searchParams.keys()][0]);
    const selectedIndex = currentTab !== -1 ? currentTab : 0;

    // Function to handle tab change and update the URL without '='
    const handleTabChange = (index: any) => {
        navigate(`?${tabMap[index]}`, { replace: true });
    };

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.mainSettings') },
    ];

    const renderModals = () => (
        <>
            <Breadcrumb items={breadcrumbItems} />

            <Tab.Group selectedIndex={selectedIndex} onChange={handleTabChange}>
                {/* <Tab.List className="mt-3 flex flex-wrap bg-white dark:bg-black py-3 px-4">
                    {tabMap.map((tab, index) => (
                        <Tab as={Fragment} key={index}>
                            {({ selected }) => (
                                <button
                                    className={`font-bold text-[16px] ${selected ? 'text-primary !outline-none before:!w-full' : ''
                                        } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-primary before:transition-all before:duration-700 hover:text-primary hover:before:w-[80%]`}
                                >
                                    {t(`settings.${tab}`)}
                                </button>
                            )}
                        </Tab>
                    ))}
                </Tab.List> */}
                <button
                    className={`font-bold text-[16px]  text-primary dark:text-dark-light relative -mb-[1px] flex items-center p-5 py-3 border-b-2`}
                >
                    {t(`settings.general`)}
                </button>
                <Tab.Panels>
                    <Tab.Panel>
                        <Social />
                    </Tab.Panel>
                    {/* <Tab.Panel>
                        <General />
                    </Tab.Panel> */}
                </Tab.Panels>
            </Tab.Group>
        </>
    );

    return renderModals();
}
