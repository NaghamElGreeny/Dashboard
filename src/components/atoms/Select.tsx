import { MultiSelect, Select } from '@mantine/core';

function SelectComp({
  placeholder,
  className,
  multi,
  data,
  onChange,
  name,
  defaultValue,
  icon,
}: any) {
  return (
    <>
      {multi ? (
        <MultiSelect
          // label="Creatable MultiSelect"
          data={data ? data : []}
          placeholder={placeholder}
          searchable
          className={className}
          name={name}
          creatable
          onChange={onChange}
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={(query) => {
            const item = { value: query, label: query };
            //@ts-ignore
            setData((current: any) => [...current, item]);
            return item;
          }}
        />
      ) : (
        <Select
          placeholder={placeholder}
          className={`${className}  form-control-input`}
          rightSection={icon}
          rightSectionWidth={30}
          name={name}
          onChange={onChange}
          data={data ? data : []}
          defaultValue={'ddddd'}
        />
      )}
    </>
  );
}

export default SelectComp;
