import { MultiSelect } from '@mantine/core'
import { useFormikContext } from 'formik';
import React, { useState } from 'react'


type MultiSelectTags_TP = {
    setStatus?: any;
    updateData?: any;
    resetForm?: any;
    onChange?: (option: any) => void;
    name?: string | undefined;
    label?: any;
    fieldKey?: any;
    placeholder?: string;
};

const MultiSelectTags = ({ updateData, resetForm, onChange, name, label }: MultiSelectTags_TP) => {
    const { values, setFieldValue } = useFormikContext<any>();
    const dataOptions = (updateData?.tags || []).map((tag: any) => ({
        label: tag.name,
        value: tag.id,
      }));

    const [data, setData] = useState<any>([...dataOptions]);





  return (
    <MultiSelect
        data={data}
        placeholder="Select items"
        searchable
        // defaultValue={{ label: !resetForm ? updateData?.tags?.name : 'Select Tag', value: updateData?.country?.id }}
        creatable
        getCreateLabel={(query) => `+ Create ${query}`}
        onCreate={(query) => {
        const item = { value: query, label: query };
        setData((current:any) => [...current, item]);
        setFieldValue('tags',data);
        return item;
        }}

  />
  )
}

export default MultiSelectTags
