import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';

export default function MainDataBanUser() {
    const { t } = useTranslation();
    const { setFieldValue, values } = useFormikContext<{ [key: string]: any }>();

    return (
        <>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12">
                    <BaseInputField
                        label={t('labels.ban_reason')}
                        name="ban_reason"
                        id="ban_reason"
                        type="textarea"
                        className="border"
                        placeholder={t('enter') + ' ' + t('labels.ban_reason')}
                        defaultValue={values.description}
                    />
                </div>
            </div>
        </>
    );
}
