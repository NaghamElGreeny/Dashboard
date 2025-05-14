// CardItem.tsx

import React from 'react';

interface CardItemProps {
    icon?: React.ReactNode;
    label?: string;
    value?: React.ReactNode;
    hasToggle?: boolean;
}

const CardItem: React.FC<CardItemProps> = ({ icon, label, value, hasToggle }) => {
    return (
        <div className="flex items-center p-4 bg-transparent dark:border-[#17263c] border border-gray-200 rounded-lg shadow-sm">
            <div className="w-10 h-10 text-primary flex items-center justify-center">{icon}</div>

            {hasToggle ? (
                <div className="flex justify-between items-center w-full">
                    <p className="text-gray-500 font-bold ">{label}</p>
                    <div className="ml-2 ">{value}</div>
                </div>
            ) : (
                <div className="ml-4">
                    <p className="text-gray-500 font-bold">{label}</p>
                    <p className="font-semibold text-primary">{value}</p>
                </div>
            )}
        </div>
    );
};

export default CardItem;
