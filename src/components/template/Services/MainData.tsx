import { Skeleton } from '@mantine/core';
import { FieldArray, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';
import GeneralCustomSelect from '../../molecules/selects/Products/GeneralCustomSelect';

export default function ServicesMainData({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();
    const { setFieldValue, values } = useFormikContext<{ [key: string]: any }>();

    const typesList = [
        {
            id: 0,
            value: 'online',
            label: t('labels.online'),
        },
        {
            id: 1,
            value: 'offline',
            label: t('labels.offline'),
        },
    ];

    return (
        <>
            <FieldArray
                name="services"
                render={() => (
                    <>
                        {values.services.map((service: any, index: number) => (
                            <>
                                <div
                                    key={index}
                                    className="grid grid-cols-12 gap-2 items-center mb-4"
                                >
                                    <div className="col-span-12 ">
                                        {isLoading ? (
                                            <Skeleton height={40} className="w-full" />
                                        ) : (
                                            <GeneralCustomSelect
                                                name={`services[${index}].type`}
                                                optionsList={typesList}
                                                label={`${t('labels.type')}  ${index + 1}`}
                                                placeholder={t('select') + ' ' + t('labels.type')}
                                                onChange={(option: any) =>
                                                    setFieldValue(
                                                        `services[${index}].type`,
                                                        option?.value
                                                    )
                                                }
                                                // value={values?.services[index]?.type || ''}
                                                value={service?.type || ''}
                                            />
                                        )}
                                    </div>

                                    <div className="col-span-12 sm:col-span-6">
                                        {isLoading ? (
                                            <Skeleton height={40} className="w-full" />
                                        ) : (
                                            <BaseInputField
                                                label={
                                                    `${t('labels.service')} ${index + 1}` +
                                                    t('inArabic')
                                                }
                                                name={`services[${index}].ar_service`}
                                                id={`services[${index}].ar_service`}
                                                type="text"
                                                className="border"
                                                defaultValue={service.ar_service}
                                                placeholder={`${t('enter')} ${t('labels.service')}`}
                                                onChange={(e) =>
                                                    setFieldValue(
                                                        `services[${index}].ar_service`,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        )}
                                    </div>
                                    <div className="col-span-12 sm:col-span-6">
                                        {isLoading ? (
                                            <Skeleton height={40} className="w-full" />
                                        ) : (
                                            <BaseInputField
                                                label={
                                                    `${t('labels.service')} ${index + 1}` +
                                                    t('inEnglish')
                                                }
                                                name={`services[${index}].en_service`}
                                                id={`services[${index}].en_service`}
                                                type="text"
                                                className="border"
                                                defaultValue={service.en_service}
                                                placeholder={`${t('enter')} ${t('labels.service')}`}
                                                onChange={(e) =>
                                                    setFieldValue(
                                                        `services[${index}].en_service`,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                                {index - 1 < 0 && <hr className="my-5" />}
                            </>
                        ))}
                    </>
                )}
            />
        </>
    );
}
