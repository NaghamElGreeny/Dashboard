import { Skeleton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../../atoms/BaseInputField';

export default function MainDataGeneral({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();

    const fields = [
        { name: 'nearest_provider_range', type: 'number', label: 'labels.nearest_provider_range' },
        { name: 'reschedule_booking_duration', type: 'number', label: 'labels.reschedule_booking_duration' },
        { name: 'confirm_order_duration', type: 'number', label: 'labels.confirm_order_duration' },
        {
            name: 'order_cancellation_period',
            type: 'number',
            label: 'labels.order_cancellation_period',
        },
        {
            name: 'cancellation_precentage_refund',
            type: 'number',
            label: 'labels.cancellation_precentage_refund',
        },
        {
            name: 'notification_duration_period',
            type: 'number',
            label: 'labels.notification_duration_period',
        },
        { name: 'link_duration_period', type: 'number', label: 'labels.link_duration_period' },
        {
            name: 'provider_activation_period',
            type: 'number',
            label: 'labels.provider_activation_period',
        },
        {
            name: 'provider_duration_order_acception',
            type: 'number',
            label: 'labels.provider_duration_order_acception',
        },
        { name: 'provider_free_sessions', type: 'number', label: 'labels.provider_free_sessions' },
        {
            name: 'provider_free_sessions_duration',
            type: 'number',
            label: 'labels.provider_free_sessions_duration',
        },
        { name: 'additional_fees', type: 'number', label: 'labels.additional_fees' },
    ];

    return (
        <div className="grid grid-cols-12 gap-2">
            {fields.map(({ name, type, label }, index) => (
                <div key={index} className="col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t(label)}
                            name={name}
                            id={name}
                            // @ts-ignore
                            type={type}
                            className="border"
                            placeholder={t('enter') + ' ' + t(label)}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
