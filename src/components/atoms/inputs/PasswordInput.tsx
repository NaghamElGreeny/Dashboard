import { useTranslation } from 'react-i18next';
import { BaseInput } from './Base';
import { Label } from '../Label';
type Props_TP = {
    [key: string]: any;
};
export const PasswordInput = ({ id, label, name, ...props }: { id: string } & Props_TP) => {
    const { t } = useTranslation();
    return (
        <>
            {label && (
                <Label htmlFor={id} className="mb-[0.29rem]">
                    {t(label)}
                </Label>
            )}
            <BaseInput
                id={id}
                name={name}
                {...{
                    ...props,
                    type: 'password',
                }}
            />
        </>
    );
};
