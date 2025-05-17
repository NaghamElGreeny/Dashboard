import { Skeleton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';
import CKeditor from '../../atoms/EditorCustom';

export default function FaqMainData({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();

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
                        <CKeditor
                            id="ar_answer"
                            name="ar_answer"
                            label={t('labels.answer') + t('inArabic')}
                        // placeholder={t('enter') + ' ' + t('labels.answer')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={100} className="w-full" />
                    ) : (
                        <CKeditor
                            id="en_answer"
                            name="en_answer"
                            label={t('labels.answer') + t('inEnglish')}
                        // placeholder={t('enter') + ' ' + t('labels.answer')}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
