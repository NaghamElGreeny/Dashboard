import { useFormikContext } from 'formik';
import { ChangeEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseInput } from '../../atoms';
import { CheckBoxField } from '../../molecules';

type PermissionItem = {
    id: string;
    title: string;
};

type PermissionsGroup = {
    [key: string]: PermissionItem[];
};

type PermissionsProps_TP = {
    permissions: PermissionsGroup;
    name?: string;
    editData?: any;
    showPermissions?: boolean;
};

export const Permissions = ({
    name,
    permissions,
    editData = [],
    showPermissions = true,
}: PermissionsProps_TP) => {
    const { t } = useTranslation();
    const { setFieldValue, values, initialValues } = useFormikContext<any>();

    useEffect(() => {
        if (!Object.keys(values).length) {
            Object.entries(initialValues).forEach(([key, value]) => {
                setFieldValue(key, value);
            });
        }
    }, [showPermissions, values, initialValues, setFieldValue]);

    const renderPermissionCheckbox = (item: PermissionItem) => (
        <div key={item.id} className="flex items-center">
            <BaseInput
                type="checkbox"
                id={item.id}
                name={item.id}
                checked={values[item.id] || false}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const checked = e.target.checked;
                    setFieldValue(item.id, checked ? item.id : '');
                }}
                className="mr-2"
            />
            <label htmlFor={item.id}>{item.title}</label>
        </div>
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {Object.entries(permissions)?.map(([key, items]) => (
                <div key={key} className="col-span-1">
                    <div className="bg-white m-5 rounded-xl dark:bg-black">
                        <div className="shadow border rounded-xl p-3 gap-4 h-[250px] overflow-y-auto">
                            <h2 className="border-b-2 p-1 dark:text-dark-textWhite mb-4 pb-3">
                                {t(`permissions.${key}`)}
                            </h2>
                            {items?.length &&
                                items.map((item) =>
                                    showPermissions ? (
                                        renderPermissionCheckbox(item)
                                    ) : (
                                        <CheckBoxField
                                            key={item.id}
                                            label={item.title}
                                            type="checkbox"
                                            id={item.id}
                                            name={item.id}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                setFieldValue(
                                                    item.id,
                                                    e.target.checked ? item.id : ''
                                                );
                                            }}
                                            editData={editData}
                                        />
                                    )
                                )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
