import { Skeleton } from '@mantine/core';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';
import GeneralStaticSelect from '../../molecules/selects/GeneralStaticSelect';
import DateInput from '../../../components/atoms/DateInput';
import TimeInp from '../../atoms/inputs/TimeInp';
import { useParams } from 'react-router-dom';

export default function MainDataCoupons({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();

    const { setFieldValue, values } = useFormikContext<{ [key: string]: any }>();

    const id = useParams();

    const date = new Date();

    const statusList = [
        {
            id: 0,
            value: 0,
            status: false,
            label: t('labels.inactive'),
        },
        {
            id: 1,
            value: 1,
            status: true,
            label: t('labels.active'),
        },
    ];

    const typesList = [
        {
            id: 0,
            value: 'fixed',
            label: t('labels.fixed'),
        },
        {
            id: 1,
            value: 'percentage',
            label: t('labels.percentage'),
        },
    ];

    return (
        <>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.code')}
                            name="code"
                            id="code"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.code')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.value')}
                            name="value"
                            id="value"
                            type="number"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.value')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.max_limit')}
                            name="max_limit"
                            id="max_limit"
                            type="number"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.max_limit')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.usage_limit')}
                            name="user_limit"
                            id="user_limit"
                            type="number"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.usage_limit')}
                        />
                    )}
                </div>

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
                        <GeneralStaticSelect
                            name="is_active"
                            dataOptions={statusList}
                            label={t('labels.status')}
                            placeholder={t('select') + ' ' + t('labels.status')}
                            onChange={(option: any) => setFieldValue('is_active', option?.value)}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={100} className="w-full" />
                    ) : (
                        <DateInput
                            minDateValue={id && id.id ? '' : date}
                            label={t('labels.start_date')}
                            name="start_date"
                            placeholder={t('enter') + ' ' + t('labels.start_date')}
                            defaultValue={values.start_date}
                            disabled={false}
                            required={false}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={100} className="w-full" />
                    ) : (
                        <DateInput
                            minDateValue={values.start_date}
                            label={t('labels.end_date')}
                            name="end_date"
                            placeholder={t('enter') + ' ' + t('labels.end_date')}
                            defaultValue={values.end_date}
                            disabled={!values.start_date}
                            required={false}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <TimeInp
                            label={t('labels.start_time')}
                            name="start_time"
                            defaultValue={values.start_time}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <TimeInp
                            label={t('labels.end_time')}
                            name="end_time"
                            defaultValue={values.end_time}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
