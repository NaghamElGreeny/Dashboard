import { useTranslation } from 'react-i18next';
import { Label } from '../../atoms';
import { BaseInputField } from '../../atoms/BaseInputField';
import NewUploadImgRepeaterAttachment from '../../atoms/NewUploadImgRepeaterAttachment';
import { useFormikContext } from 'formik';
import { CustomInputPhone } from '../../atoms/customphoneinput/CustomInputPhone';

export default function PasswordMainData() {
    const { t } = useTranslation();

    const { setFieldValue, setFieldTouched, errors, touched, values } = useFormikContext<{
        [key: string]: any;
    }>();

    return (
        <>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 sm:col-span-6">
                    <BaseInputField
                        label={t('labels.password')}
                        name="password"
                        id="password"
                        type="password"
                        placeholder={t('enter') + ' ' + t('labels.password')}
                    />
                </div>
                <div className="col-span-12 sm:col-span-6">
                    <BaseInputField
                        label={t('labels.new_password')}
                        name="new_password"
                        id="new_password"
                        type="password"
                        placeholder={t('enter') + ' ' + t('labels.new_password')}
                    />
                </div>
                <div className="col-span-12 sm:col-span-6">
                    <BaseInputField
                        label={t('labels.password_confirmation')}
                        name="password_confirmation"
                        id="password_confirmation"
                        type="password"
                        placeholder={t('enter') + ' ' + t('labels.password_confirmation')}
                    />
                </div>
            </div>
        </>
    );
}
