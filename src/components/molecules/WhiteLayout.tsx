import React from 'react';

interface WhiteLayoutProps {
    children: React.ReactNode;
}

const WhiteLayout: React.FC<WhiteLayoutProps> = ({ children }) => {
    return (
        <div className="bg-white dark:bg-dark-dark-light text-start rounded-lg dark:rounded-none p-0 px-6 pt-4 py-8 gap-x-4 gap-y-8 relative ">
            {children}
        </div>
    );
};

export default WhiteLayout;
