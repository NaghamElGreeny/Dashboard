import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';

export default function MainDataReply() {
    const { t } = useTranslation();
    const { setFieldValue, values } = useFormikContext<{ [key: string]: any }>();

    return (
        <>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12">
                    <BaseInputField
                        label={t('labels.reply')}
                        name="reply"
                        id="reply"
                        type="textarea"
                        className="border"
                        placeholder={t('enter') + ' ' + t('labels.reply')}
                        defaultValue={values.description}
                    />
                </div>
            </div>
        </>
    );
}
