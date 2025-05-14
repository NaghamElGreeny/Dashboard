import { Skeleton } from '@mantine/core';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { Label } from '../../atoms';
import { BaseInputField } from '../../atoms/BaseInputField';
import CustomPhoneInput from '../../atoms/CustomPhoneInput';
import NewUploadImgRepeaterAttachment from '../../atoms/NewUploadImgRepeaterAttachment';
import GeneralStaticSelect from '../../molecules/selects/GeneralStaticSelect';

export default function ClientsMainData({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();

    const date = new Date();

    const { setFieldValue, setFieldTouched, errors, touched, values } = useFormikContext<{
        [key: string]: any;
    }>();

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

    return (
        <>
            <div className="grid grid-cols-12 gap-2">
                <div className="grid grid-cols-1 gap-2 col-span-12 mb-4">
                    <div className="flex flex-col items-center justify-center w-full my-4">
                        {isLoading ? (
                            <Skeleton height={100} circle />
                        ) : (
                            <>
                                <Label htmlFor="image" className="mb-1">
                                    {t('labels.image')}
                                </Label>

                                <NewUploadImgRepeaterAttachment
                                    acceptFiles="image/png, image/jpeg, image/gif"
                                    name="image"
                                    isBinary={true}
                                />
                            </>
                        )}
                    </div>
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.full_name')}
                            name="full_name"
                            id="full_name"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.full_name')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.email')}
                            name="email"
                            id="email"
                            type="email"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.email')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <CustomPhoneInput label={t('labels.phone')} name="phone" />
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
            </div>
        </>
    );
}
