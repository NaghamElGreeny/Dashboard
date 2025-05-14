import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import CKeditor from '../../../atoms/EditorCustom';
import { Skeleton } from '@mantine/core';

export default function MainDataAboutUs({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();
    const { values } = useFormikContext<{ [key: string]: any }>();

    const fields = [
        { name: 'about_ar', label: 'labels.about_ar' },
        { name: 'about_en', label: 'labels.about_en' },
    ];

    return (
        <div className="grid grid-cols-12 gap-2">
            {fields.map(({ name, label }, index) => (
                <div key={index} className="col-span-6">
                    {isLoading ? (
                        <Skeleton height={150} className="w-full" />
                    ) : (
                        <CKeditor id="4" label={t(label)} name={name} />
                    )}
                </div>
            ))}
        </div>
    );
}
