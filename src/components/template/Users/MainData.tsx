import { Skeleton } from '@mantine/core';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { Label } from '../../atoms';
import { BaseInputField } from '../../atoms/BaseInputField';
import CustomPhoneInput from '../../atoms/CustomPhoneInput';
import NewUploadImgRepeaterAttachment from '../../atoms/NewUploadImgRepeaterAttachment';
import GeneralStaticSelect from '../../molecules/selects/GeneralStaticSelect';
import GeneralSelect from '../../molecules/selects/GeneralSelect';
import DateInput from '../../atoms/DateInput';

export default function UsersMainData({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();

    const date = new Date();

    const { setFieldValue, setFieldTouched, errors, touched, values } = useFormikContext<{
        [key: string]: any;
    }>();

    const genderList = [
        {
            id: 0,
            value: 'male',
            label: t('labels.male'),
        },
        {
            id: 1,
            value: 'female',
            label: t('labels.female'),
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
                                    model="users"
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
                            label={t('labels.name')}
                            name="name"
                            id="name"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.name')}
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
                            name="gender"
                            dataOptions={genderList}
                            label={t('labels.gender')}
                            placeholder={t('select') + ' ' + t('labels.gender')}
                            onChange={(option: any) => setFieldValue('gender', option?.value)}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <GeneralSelect
                            label={t('labels.country')}
                            placeholder={t('select') + ' ' + t('labels.country')}
                            apiName="countries_without_pagination"
                            name="country_id"
                            onChange={(option: any) => setFieldValue('country_id', option)}
                        />
                    )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <DateInput
                            label={t('labels.date_of_birth')}
                            name="date_of_birth"
                            placeholder={t('enter') + ' ' + t('labels.date_of_birth')}
                            defaultValue={values.date_of_birth}
                            disabled={false}
                            required={false}
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
                        <BaseInputField
                            label={t('labels.password_confirmation')}
                            name="password_confirmation"
                            id="password_confirmation"
                            type="password"
                            placeholder={t('enter') + ' ' + t('labels.password_confirmation')}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
