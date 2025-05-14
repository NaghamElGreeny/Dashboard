import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IRootState } from '../../store';
import { toggleTheme } from '../../store/themeConfigSlice';




import LighThemeIcon from '../atoms/icons/LighThemeIcon';
import DarkThemeIcon from '../atoms/icons/DarkThemeIcon';
import { useTranslation } from 'react-i18next';
import ThemeSwitchButton from '../atoms/buttons/ThemeSwitchButton';

const ThemeSwitch = () => {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const [, setTheme] = useState<any>();
    const dispatch = useDispatch();
    const { t } = useTranslation();
  return (
    <div>
        {themeConfig.theme === 'light' ? (
            <ThemeSwitchButton
                action={() => {
                    setTheme('dark');
                    dispatch(toggleTheme('dark'));
                }}
            >
                <LighThemeIcon />
            </ThemeSwitchButton>
        ) : (
            ''
        )}
        {themeConfig.theme === 'dark' && (
            <ThemeSwitchButton
                action={() => {
                    setTheme('light');
                    dispatch(toggleTheme('light'));
                }}
            >
                <DarkThemeIcon />
            </ThemeSwitchButton>
        )}
</div>
  )
}

export default ThemeSwitch
