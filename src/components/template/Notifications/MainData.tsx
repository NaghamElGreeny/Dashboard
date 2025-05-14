import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';
import GeneralSelect from '../../molecules/selects/GeneralSelect';
import GeneralStaticSelect from '../../molecules/selects/GeneralStaticSelect';

export default function MainDataNotifications() {
    const { t } = useTranslation();
    const { setFieldValue, values } = useFormikContext<{ [key: string]: any }>();

    const typesList = [
        {
            id: 0,
            value: 'all_clients',
            label: t('labels.all_clients'),
        },
        {
            id: 1,
            value: 'all_providers',
            label: t('labels.all_providers'),
        },

        {
            id: 2,
            value: 'specific_provider',
            label: t('labels.specific_provider'),
        },
        {
            id: 3,
            value: 'specific_client',
            label: t('labels.specific_client'),
        },
    ];

    return (
        <>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 sm:col-span-6">
                    <BaseInputField
                        label={t('labels.title') + t('inArabic')}
                        name="ar_title"
                        id="ar_title"
                        type="text"
                        className="border"
                        placeholder={t('enter') + ' ' + t('labels.title')}
                    />
                </div>

                <div className="col-span-12 sm:col-span-6">
                    <BaseInputField
                        label={t('labels.title') + t('inEnglish')}
                        name="en_title"
                        id="en_title"
                        type="text"
                        className="border"
                        placeholder={t('enter') + ' ' + t('labels.title')}
                    />
                </div>

                <div className="col-span-12 sm:col-span-6">
                    <BaseInputField
                        label={t('labels.message') + t('inArabic')}
                        name="ar_body"
                        id="ar_body"
                        type="textarea"
                        className="border"
                        placeholder={t('enter') + ' ' + t('labels.message')}
                    />
                </div>

                <div className="col-span-12 sm:col-span-6">
                    <BaseInputField
                        label={t('labels.message') + t('inEnglish')}
                        name="en_body"
                        id="en_body"
                        type="textarea"
                        className="border"
                        placeholder={t('enter') + ' ' + t('labels.message')}
                    />
                </div>

                <div className="col-span-12 sm:col-span-6">
                    <GeneralStaticSelect
                        name="type"
                        dataOptions={typesList}
                        label={t('labels.user_type')}
                        placeholder={t('select') + ' ' + t('labels.user_type')}
                        onChange={(option: any) => setFieldValue('type', option?.value)}
                    />
                </div>

                {values.type === 'specific_provider' || values.type === 'specific_client' ? (
                    <div className="col-span-12 sm:col-span-6">
                        <GeneralSelect
                            isGeneral={true}
                            isMultiple={true}
                            name="user_ids"
                            label={
                                values.type === 'specific_provider'
                                    ? t('labels.providers')
                                    : t('labels.clients')
                            }
                            placeholder={
                                values.type === 'specific_provider'
                                    ? t('select') + ' ' + t('labels.providers')
                                    : t('select') + ' ' + t('labels.clients')
                            }
                            apiName={
                                values.type === 'specific_provider'
                                    ? 'provider/list-without-pag'
                                    : 'client/list-without-pag'
                            }
                            onChange={(userIds: any) => setFieldValue('user_ids', userIds)}
                        />
                    </div>
                ) : (
                    ''
                )}
            </div>
        </>
    );
}
