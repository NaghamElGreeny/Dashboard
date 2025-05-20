import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Loading from '../components/atoms/loading';
import StatisticsCard from '../components/molecules/StatisticsCard';
import { hasPermission } from '../helper/permissionHelpers';
import useFetch from '../hooks/UseFetch';
import { setPageTitle } from '../store/themeConfigSlice';
import logo from '/assets/images/logo.png';
import { Link } from 'react-router-dom';
import Rating from '../components/molecules/Rating/Rating';
import defaultAvatar from '/assets/images/avatar.jpg';
interface ChartItem {
    count: number;
    title: string;
}

interface HighlyRatedProviderItem {
    id: number;
    avg_rating: number;
    image: string;
    name: string;
}

interface LowRatedProviderItem {
    id: number;
    avg_rating: number;
    image: string;
    name: string;
}

interface MostRequestedCategories {
    id: number;
    name: string;
    total_requests: number;
}

interface MostRequestedServices {
    id: number;
    name: string;
    total_requests: number;
}

interface ChartsData {
    statistics: ChartItem[];
    highly_rated_providers: HighlyRatedProviderItem[];
    low_rated_providers: LowRatedProviderItem[];
    most_requested_categories: MostRequestedCategories[];
    most_requested_services: MostRequestedServices[];
    total_revenue: number;
}

const Index = () => {
    const { t } = useTranslation();

    return (
        <>
            <div className="flex flex-col items-center dark:bg-transparent p-6 w-full">

                <img src={logo || defaultAvatar} alt="logo" className='w-20' />


                {/* <h2 className='text-center text-3xl'>
                    {t('sidebar.dashboard')}
                </h2> */}
            </div>
        </>
    );
};

export default Index;
