import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';

import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import Dropdown from '../Dropdown';
import { useIsRTL } from '../../hooks/useIsRTL';
import { toggleLocale, toggleRTL } from '../../store/themeConfigSlice';

const DropDownLang = () => {
    // Retrieve default language from localStorage or fallback to Arabic ('ar')
    const defaultLanguage = localStorage.getItem('i18nextLng') || 'ar';

    const isRtl =
        useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);

    const [flag, setFlag] = useState(defaultLanguage);
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const rtl = useIsRTL();

    useEffect(() => {
        // Set the initial language based on localStorage
        i18next.changeLanguage(defaultLanguage);
        if (defaultLanguage === 'ar') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
        setFlag(defaultLanguage);
    }, [defaultLanguage, dispatch]);

    //  const handleLanguageChange = (code: string) => {
    //      i18next.changeLanguage(code);
    //      localStorage.setItem('i18nextLng', code); // Save the language to localStorage

    //      if (code === 'ar') {
    //          dispatch(toggleRTL('rtl'));
    //      } else {
    //          dispatch(toggleRTL('ltr'));
    //      }

    //      setFlag(code);
    //  };

    return (
        <div className="dropdown shrink-0">
            <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                button={
                    <img
                        className="w-5 h-5 object-cover rounded-full"
                        src={`/assets/images/flags/${flag.toUpperCase()}.svg`}
                        alt="flag"
                    />
                }
            >
                <ul className="!px-2 text-dark dark:text-white-dark flex flex-col gap-2 font-semibold dark:text-white-light/90 w-[170px]">
                    {themeConfig.languageList.map((item: any) => {
                        return (
                            <li key={item.code}>
                                <button
                                    type="button"
                                    className={`flex w-full hover:text-primary rounded-lg ${
                                        i18next.language === item.code
                                            ? 'bg-primary/10 text-primary'
                                            : ''
                                    }`}
                                    onClick={() => {
                                        i18next.changeLanguage(item.code);
                                        dispatch(toggleRTL(!rtl ? 'rtl' : 'ltr'));
                                        // dispatch(toggleLocale(rtl ? 'ar' : 'en'));

                                        setFlag(item.code);
                                    }}
                                    // onClick={() => handleLanguageChange(item.code)}
                                >
                                    <img
                                        src={`/assets/images/flags/${item.code.toUpperCase()}.svg`}
                                        alt="flag"
                                        className="w-5 h-5 object-cover rounded-full"
                                    />
                                    <span className="ltr:ml-3 rtl:mr-3">{item.name}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </Dropdown>
        </div>
    );
};

export default DropDownLang;
