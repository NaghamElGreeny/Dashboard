import React from 'react';

// Function to generate a random gradient color
const getRandomColor = () => {
    const colors = [
        { from: '#62A7EA', to: '#62EAE1' },
        { from: '#FFB562', to: '#FF6370' },
        { from: '#EA62C8', to: '#9E62EA' },
        { from: '#62EABC', to: '#EABC62' },
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

// Props type definition
interface StatisticsCardProps {
    title: string;
    count: number;
    index?: any; // Add an index to uniquely identify each card for the gradient ID
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ title, count, index }) => {
    const color = getRandomColor();

    return (
        <div className="p-6 bg-white dark:bg-black rounded-lg shadow-md flex justify-between items-center">
            <div className="relative flex items-center justify-center">
                {/* Circle Progress */}
                <svg width="50" height="50" viewBox="0 0 36 36" className="circular-chart">
                    <path
                        className="circle-bg"
                        d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e6e6e6"
                        strokeWidth="2"
                    />
                    <path
                        className="circle"
                        strokeDasharray={'100'}
                        d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831"
                        fill="none"
                        stroke={`url(#gradient-${index})`} // Unique gradient reference
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    <defs>
                        <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={color.from} />
                            <stop offset="100%" stopColor={color.to} />
                        </linearGradient>
                    </defs>
                    {/* Arrow in the middle of the circle */}
                    <svg
                        x="6"
                        y="6"
                        width="25"
                        height="25"
                        viewBox="0 0 71 71"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M38.3198 27.9923C38.3198 27.7747 38.4062 27.5661 38.56 27.4122C38.7139 27.2584 38.9225 27.1719 39.1401 27.1719H45.7028C45.9204 27.1719 46.129 27.2584 46.2829 27.4122C46.4367 27.5661 46.5231 27.7747 46.5231 27.9923V34.555C46.5231 34.7725 46.4367 34.9812 46.2829 35.135C46.129 35.2889 45.9204 35.3753 45.7028 35.3753C45.4852 35.3753 45.2766 35.2889 45.1227 35.135C44.9689 34.9812 44.8825 34.7725 44.8825 34.555V30.2892L38.9547 37.5361C38.8821 37.6246 38.7918 37.697 38.6896 37.7486C38.5874 37.8002 38.4755 37.8298 38.3611 37.8355C38.2467 37.8412 38.1325 37.8229 38.0256 37.7818C37.9187 37.7407 37.8216 37.6777 37.7406 37.5968L33.4962 33.3524L27.4979 41.6C27.3667 41.7669 27.1759 41.8764 26.9656 41.9055C26.7554 41.9346 26.542 41.8811 26.3704 41.7562C26.1987 41.6313 26.0822 41.4447 26.0452 41.2357C26.0083 41.0267 26.0538 40.8115 26.1722 40.6353L32.7349 31.6116C32.8046 31.5156 32.8942 31.4359 32.9976 31.3779C33.1011 31.32 33.2158 31.2851 33.334 31.2757C33.4522 31.2664 33.5711 31.2828 33.6823 31.3237C33.7936 31.3647 33.8947 31.4294 33.9785 31.5132L38.2591 35.7953L43.9719 28.8126H39.1401C38.9225 28.8126 38.7139 28.7262 38.56 28.5723C38.4062 28.4185 38.3198 28.2098 38.3198 27.9923Z"
                            fill="none"
                            stroke={`url(#gradient-${index})`}
                            strokeWidth="2.5"
                        />
                    </svg>
                </svg>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-sm text-gray-500">{title}</span>
                <span className="text-2xl font-bold text-black dark:text-white-light">
                    {Math.floor(count)}
                </span>
            </div>
        </div>
    );
};

export default StatisticsCard;
