import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import CKeditor from '../../../atoms/EditorCustom';
import { Skeleton } from '@mantine/core';

export default function MainDataTerms({ isLoading }: { isLoading?: boolean }) {
    const { t } = useTranslation();
    const { values } = useFormikContext<{ [key: string]: any }>();

    const fields = [
        { name: 'terms_and_conditions_ar', label: 'labels.terms_and_conditions_ar' },
        { name: 'terms_and_conditions_en', label: 'labels.terms_and_conditions_en' },
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
