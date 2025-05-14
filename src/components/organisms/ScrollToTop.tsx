import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const location = useLocation();
    useEffect(() => {
        window.scrollTo({
            top: 100,
            left: 100,
            // @ts-ignore
            behavior: 'instant',
        });
    }, [location]);

    return null;
}
