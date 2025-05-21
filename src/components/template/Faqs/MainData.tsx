import { Skeleton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';
import { TextAreaField } from '../../molecules';
import GeneralStaticSelect from '../../molecules/selects/GeneralStaticSelect';
import { useFormikContext } from 'formik';

export default function FaqMainData({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();
    const { setFieldValue, values } = useFormikContext<any>();
    const activeStatus = [
        { id: 0, value: 0, label: t('labels.inactive') },
        { id: 1, value: 1, label: t('labels.active') },
    ]
    return (
        <>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.question') + t('inArabic')}
                            name="ar_question"
                            id="ar_question"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.question')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.question') + t('inEnglish')}
                            name="en_question"
                            id="en_question"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.question')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={100} className="w-full" />
                    ) : (

                        <TextAreaField
                            id="ar_answer"
                            name="ar_answer"
                            rows={5}
                            label={t('labels.answer') + t('inArabic')}
                            placeholder={t('enter') + ' ' + t('labels.answer')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={100} className="w-full" />
                    ) : (
                        <TextAreaField
                            id="en_answer"
                            name="en_answer"
                            rows={5}
                            label={t('labels.answer') + t('inEnglish')}
                            placeholder={t('enter') + ' ' + t('labels.answer')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralStaticSelect
                            name="is_active"
                            dataOptions={activeStatus}
                            label={t('labels.status')}
                            placeholder={t('select') + ' ' + t('labels.type')}
                            onChange={(option: any) => setFieldValue('is_active', option?.value)}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
