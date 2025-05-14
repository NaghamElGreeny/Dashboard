import { Link } from 'react-router-dom';

interface BreadcrumbItem {
    label: string;
    to?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <ol className="flex text-primary font-semibold dark:text-white-dark pb-4">
            {items.map((item, index) => {
                const isOdd = index % 2 !== 0; // Check if the index is odd
                const commonClasses =
                    'p-1.5 ltr:pl-6 rtl:pr-6 ltr:pr-2 rtl:pl-2 relative h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:z-[1]';

                const dynamicClasses = isOdd
                    ? 'bg-primary text-white before:border-l-primary'
                    : 'bg-[#ebedf2] dark:bg-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70 before:border-l-[#ebedf2] dark:before:border-l-[#1b2e4b]';

                const itemClasses = `${commonClasses} ${dynamicClasses}`;

                return (
                    <li
                        key={index}
                        className={`${index === 0 ? 'ltr:rounded-l-md rtl:rounded-r-md' : ''}`}
                    >
                        {item.to ? (
                            <Link to={item.to} className={itemClasses}>
                                {item.label}
                            </Link>
                        ) : (
                            <span className={itemClasses}>{item.label}</span>
                        )}
                    </li>
                );
            })}
        </ol>
    );
}
