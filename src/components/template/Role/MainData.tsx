import { Skeleton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { BaseInputField } from '../../atoms/BaseInputField';
import { InnerFormLayout } from '../../molecules/InnerFormLayout';
import { Permissions } from './Permissions';

export const RolesMainData = (
    { permissions, editData, showPermissions }: any,
    { isLoading }: { isLoading?: boolean }
) => {
    const { t } = useTranslation();

    return (
        <InnerFormLayout layoutStyle={'my-8'} scroll={true}>
            <div className="grid grid-cols-4 gap-4 col-span-3">
                <div className="col-span-2 p-4 sm:p-0">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.name') + t('inArabic')}
                            name="ar_name"
                            id="ar_name"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.name')}
                        />
                    )}
                </div>
                <div className="col-span-2 p-4 sm:p-0">
                    {isLoading ? (
                        <Skeleton height={40} className="w-full" />
                    ) : (
                        <BaseInputField
                            label={t('labels.name') + t('inEnglish')}
                            name="en_name"
                            id="en_name"
                            type="text"
                            className="border"
                            placeholder={t('enter') + ' ' + t('labels.name')}
                        />
                    )}
                </div>

                <div className="flex flex-col gap-1 col-span-4">
                    {isLoading ? (
                        <Skeleton height={150} className="w-full" />
                    ) : (
                        <>
                            <h4 className="flex items-center justify-center text-2xl underline dark:text-dark-textWhite underline-offset-2 decoration-1 mb-5 dark:text-dark-textWhite">
                                {t('labels.permissions')}
                            </h4>

                            <Permissions
                                // key={id}
                                // name={name}
                                permissions={permissions}
                                editData={editData}
                                showPermissions={showPermissions}
                            />
                        </>
                    )}
                </div>
            </div>
        </InnerFormLayout>
    );
};
