import { Skeleton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';
import CKeditor from '../../atoms/EditorCustom';
import { useEffect, useState } from 'react';
import useFetch from '../../../hooks/UseFetch';
import * as Yup from 'yup';
import { isArabic, isEnglish } from '../../../helper/helpers';

export default function FaqMainData({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();
    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.faqs.title'), to: '/faqs/index' },
        { label: t('breadcrumb.faqs.edit') },
    ];
    const [formKey, setFormKey] = useState(0);

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `faq/`,
        queryKey: [`faq-list`],
    });
    console.log(showData?.data)
    useEffect(() => {
        setFormKey(formKey + 1);
    }, [showDataSuccess]);

    const initialValues = {
        ar_question: showData?.data?.ar?.question || '',
        ar_answer: showData?.data?.ar?.answer || '',

        en_question: showData?.data?.en?.question || '',
        en_answer: showData?.data?.en?.answer || '',
    };

    const faqSchema = () =>
        Yup.object().shape({
            ar_question: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.question') + t('inArabic') }))
                .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value)),

            en_question: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.question') + t('inEnglish') }))
                .test('is-english', t('validations.englishText'), (value) => isEnglish(value)),

            en_answer: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.answer') + t('inEnglish') })),
            ar_answer: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.answer') + t('inArabic') })),
        });

    return (
        <>
            {/* <div className="grid grid-cols-12 gap-2"> */}
            {/* {showData?.data ? (
                    console.log(showData.data),
                    showData.data.map((q: any) => (
                        <div className="col-span-12 sm:col-span-6" key={q.id}>
                            {isLoading ? (
                                <Skeleton height={40} className="w-full" />
                            ) : (
                                <BaseInputField
                                    label={t('labels.question') + t('inArabic')}
                                    name="ar_question"
                                    id={q.id}
                                    type="text"
                                    className="border"
                                    placeholder={t('enter') + ' ' + t('labels.question')
                                    }
                                />
                            )}
                        </div>

                    ))
                ) : ''} */}

            {/* <div className="col-span-12 sm:col-span-6">
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
                </div> */}
            {/* </div > */}
        </>
    );
}
