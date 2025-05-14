import { Switch, rem } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useMantineTheme } from '@mantine/core';
import { useTranslation } from 'react-i18next';

interface SwitchProps {
    checked: boolean;
    label: string;
    onChange: () => void;
}

const Switcher: React.FC<SwitchProps> = ({ checked, onChange, label }) => {
    const theme = useMantineTheme();
    const { t } = useTranslation();

    return (
        <Switch
            thumbIcon={
                checked ? (
                    <IconCheck
                        style={{ width: rem(12), height: rem(12) }}
                        color={theme.colors.teal[6]}
                        stroke={3}
                    />
                ) : (
                    <IconX
                        style={{ width: rem(12), height: rem(12) }}
                        color={theme.colors.red[6]}
                        stroke={3}
                    />
                )
            }
            label={label}
            color={checked ? 'green' : 'red'}
            checked={checked}
            onChange={onChange}
        />
    );
};

export default Switcher;
