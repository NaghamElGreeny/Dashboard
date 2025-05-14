import { Skeleton } from '@mantine/core';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { Label } from '../../atoms';
import { BaseInputField } from '../../atoms/BaseInputField';
import NewUploadImgRepeaterAttachment from '../../atoms/NewUploadImgRepeaterAttachment';
import GeneralSelect from '../../molecules/selects/GeneralSelect';

export default function AdminsMainData({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();

    const { setFieldValue } = useFormikContext<{ [key: string]: any }>();

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
                                    model="User"
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
                            type="text"
                            placeholder={t('enter') + ' ' + t('labels.email')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.password')}
                            name="password"
                            id="password"
                            type="password"
                            placeholder={t('enter') + ' ' + t('labels.password')}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralSelect
                            label={t('labels.role')}
                            placeholder={t('select') + ' ' + t('labels.role')}
                            apiName="role\list-without-pag"
                            name="role_id"
                            onChange={(option: any) => setFieldValue('role_id', option)}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
