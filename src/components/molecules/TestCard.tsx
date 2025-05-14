import React from 'react';

// Function to generate a random color
const getRandomColor = () => {
    const colors = [
        'bg-gradient-to-r from-[#62EAE1] to-[#62A7EA]',
        'bg-gradient-to-r from-[#FF6370] to-[#FFB562]',
        'bg-gradient-to-r from-[#9E62EA] to-[#EA62C8]',
        'bg-gradient-to-r from-[#EABC62] to-[#62EABC]',
    ];

    return colors[Math.floor(Math.random() * colors.length)];
};

// Props type definition
interface StatisticsCardProps {
    title: string;
    count: number;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ title, count }) => {
    return (
        <div className={`panel ${getRandomColor()}`}>
            <div className="flex justify-between">
                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">{title}</div>
            </div>
            <div className="flex items-center mt-5">
                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">{count}</div>
            </div>
        </div>
    );
};

export default StatisticsCard;
