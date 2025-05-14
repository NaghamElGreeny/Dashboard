import { Skeleton } from '@mantine/core';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';
import GeneralStaticSelect from '../../molecules/selects/GeneralStaticSelect';

interface WalletMainDataProps {
    isLoading?: boolean;
    userType?: string;
}

export default function WalletMainData({ isLoading, userType }: WalletMainDataProps) {
    const { t } = useTranslation();
    const { setFieldValue, values } = useFormikContext<{ [key: string]: any }>();

    const date = new Date();

    const typesList = [
        {
            id: 0,
            value: 'withdrawal',
            label: t('labels.withdrawal'),
        },
        {
            id: 1,
            value: 'charge',
            label: t('labels.charge'),
        },
    ];

    return (
        <>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralStaticSelect
                            name="type"
                            dataOptions={typesList}
                            label={t('labels.type')}
                            placeholder={t('select') + ' ' + t('labels.type')}
                            onChange={(option: any) => setFieldValue('type', option?.value)}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.amountMoney')}
                            name="value"
                            id="value"
                            type="number"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.amountMoney')}
                        />
                    )}
                </div>

                {/* <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralSelectUserId
                            label={
                                userType === 'provider' ? t('labels.provider') : t('labels.client')
                            }
                            apiName={
                                userType === 'provider'
                                    ? 'povider_not_paginated'
                                    : 'client_not_paginated'
                            }
                            name="user_id"
                            placeholder={
                                userType === 'provider'
                                    ? t('select') + ' ' + t('labels.provider')
                                    : t('select') + ' ' + t('labels.client')
                            }
                            onChange={(option: any) => setFieldValue('user_id', option?.value)}
                        />
                    )}
                </div> */}
            </div>
        </>
    );
}
