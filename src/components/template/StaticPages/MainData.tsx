import { Skeleton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';
import { useFormikContext } from 'formik';
import GeneralStaticSelect from '../../molecules/selects/GeneralStaticSelect';

export default function MainDataPages({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();
    const { setFieldValue, values } = useFormikContext<{ [key: string]: any }>();


    const pageTypes = [
        {
            id: 0,
            value: 'privacy_policy',
            label: t('labels.privacy_policy'),
        },
        {
            id: 1,
            value: 'terms',
            label: t('labels.terms-conditions'),
        },
    ];


    return (
        <>
            <div className="grid grid-cols-12 gap-2">


                <div className="col-span-12">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralStaticSelect
                            name="type"
                            dataOptions={pageTypes}
                            label={t('labels.type')}
                            placeholder={t('select') + ' ' + t('labels.type')}
                            onChange={(option: any) => setFieldValue('type', option?.value)}
                            value={pageTypes.find((option) => option.value === values.type) || null}
                        //     onChange={(option: any) => {
                        //         setFieldValue('type', option?.value)
                        //         console.log('Updated type:', option?.value)
                        //     }}
                        //   value={values.type}
                        />

                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.title') + t('inArabic')}
                            name="ar_title"
                            id="ar_title"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.title')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.title') + t('inEnglish')}
                            name="en_title"
                            id="en_title"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.title')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.description') + t('inArabic')}
                            name="ar_description"
                            id="ar_description"
                            type="textarea"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.description')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.description') + t('inEnglish')}
                            name="en_description"
                            id="en_description"
                            type="textarea"
                            aria-rowspan={5}
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.description')}
                        />
                    )}
                </div>

                {/* <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralStaticSelect
                            name="type"
                            dataOptions={pageTypes}
                            label={t('labels.type')}
                            placeholder={t('select') + ' ' + t('labels.type')}
                            onChange={(option: any) => setFieldValue('type', option?.value)}
                        />
                    )}
                </div> */}


            </div>
        </>
    );
}
