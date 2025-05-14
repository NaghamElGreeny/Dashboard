import { useFormikContext } from 'formik';
import { ChangeEvent, useState } from 'react';
import Select, {
  ActionMeta,
  MultiValue,
  SingleValue,
  Theme,
} from 'react-select';
import makeAnimated from 'react-select/animated';
import CreatableSelect from 'react-select/creatable';
import { FormikError, Label, Spinner } from '../../atoms';
import { Modal } from '../Modal';

type Select_TP = {
  value?:
    | SingleValue<any>
    | MultiValue<any>
    | undefined;
  label?: string;
  name?: string;
  modalTitle?: string;
  id: string;
  isMulti?: boolean;
  required?: boolean;
  placeholder?: string;
  loadingPlaceholder?: string;
  options: any[] | undefined;
  loading?: boolean;
  onChange?: (
    option: SingleValue<any> | MultiValue<any>
  ) => void | undefined;
  creatable?: boolean;
  formatCreateLabel?: (inputValue: string) => string;
  fieldKey?: 'id' | 'value';
  isDisabled?: boolean;
  onSimpleCreate?: (inputValue: string) => void;
  onComplexCreate?: (inputValue: string) => void;
  CreateComponent?: ({
    value,
    onAdd,
    setSelectOptions,
  }: {
    value: string;
    onAdd: (value: string) => void;
    setSelectOptions?: (options: any[]) => void;
  }) => JSX.Element;
  setOptions?: (options: any[]) => void;
  defaultValue?: any;
};

const selectTheme = (theme: Theme) => ({
  ...theme,
  borderRadius: 5,
  colors: {
    ...theme.colors,
    neutral80: '#295E56',
    primary25: '#dde3ff',
    primary: '#2445ff',
  },
});

const selectClassNames = (touched: boolean, error: boolean) => ({
  control: ({ menuIsOpen }: { menuIsOpen: boolean }) =>
    `!rounded-md !shadow-none !shadow-md !border-1 ${
      touched && error ? ' !border-blue-500' : ''
    }
                  ${menuIsOpen && ' !border-blue-500'}

                  `,
  dropdownIndicator: () => `border-blue-500`,
  valueContainer: () => `!overflow-x-auto !overflow-y-hidden scrollbar`,
});

export const SelectComp = ({
  label,
  name,
  id,
  isMulti,
  required,
  placeholder,
  loadingPlaceholder,
  options,
  loading,
  onChange,
  isDisabled,
  creatable = false,
  formatCreateLabel,
  fieldKey = 'value',
  onSimpleCreate,
  CreateComponent,
  onComplexCreate,
  setOptions,
  modalTitle,
  defaultValue,
  ...props
}: Select_TP) => {
  const animatedComponents = makeAnimated();
  const { setFieldValue, errors, touched, handleBlur } = useFormikContext<{
    [key: string]: any;
  }>();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createValue, setCreateValue] = useState('');
  const handleCreate = (inputValue: string) => {
    if (onSimpleCreate) {
      onSimpleCreate(inputValue);
    } else if (CreateComponent) {
      setCreateModalOpen(true);
      setCreateValue(inputValue);
    }
  };

  var selectProps = {
    ...props,
    components: {
      ...animatedComponents,
      LoadingIndicator: () => <Spinner className='ml-2' size='medium' />,
    },
    id: id,
    defaultValue,
    name,
    isMulti,
    required,
    placeholder: loading ? loadingPlaceholder : placeholder,
    options,
    isLoading: loading && !isDisabled,
    isDisabled: loading || isDisabled,
    classNames: selectClassNames(
      !!touched[name as string],
      !!errors[name as string]
    ),
    theme: selectTheme,
    onBlur: handleBlur(name) as (e: ChangeEvent) => void,
    onChange: (
      option: SingleValue<any> | MultiValue<any>,
      actionMeta: ActionMeta<any>
    ) => {
      if (setFieldValue) {
        setFieldValue(
          name as string,
          isMulti
            ? (option as MultiValue<any>).map(
                (option) => option[fieldKey]
              )
            : (option as any)[fieldKey],

          true
        );
      }
      if (onChange) {
        onChange(option);
      }
    },
  };

  return (
    <>
      <div className='col-span-1'>
        <div className='flex flex-col gap-1'>
          {label && (
            <Label htmlFor={id} className='mb-3'>
              {label}
            </Label>
          )}
          {creatable ? (
            <>
              <CreatableSelect
                {...selectProps}
                formatCreateLabel={formatCreateLabel}
                onCreateOption={handleCreate}
              />
              {CreateComponent && (
                <Modal
                  title={modalTitle || 'Create new option'}
                  isOpen={creatable && createModalOpen}
                  onClose={() => {
                    setCreateModalOpen(false);
                  }}
                >
                  {
                    <CreateComponent
                      onAdd={(createValue) => {
                        onComplexCreate && onComplexCreate(createValue);
                        setCreateModalOpen(false);
                      }}
                      value={createValue}
                      setSelectOptions={setOptions}
                    />
                  }
                </Modal>
              )}
            </>
          ) : (
            <Select {...selectProps} />
          )}
        </div>
        <FormikError name={name as string} />
      </div>
    </>
  );
};
