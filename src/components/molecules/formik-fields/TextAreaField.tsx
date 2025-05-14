import { useFormikContext } from "formik"
import { TextAreaInputProp_TP } from "../../atoms/inputs/TextAreaInput"

import { FormikError, Label, TextAreaInput } from "../../atoms"

export const TextAreaField = ({
  label,
  name,
  placeholder,
  id,
  required,
  ...props
}: {
  label: string
  id: string
  name: string
  placeholder: string
} & TextAreaInputProp_TP) => {
  const { setFieldValue, setFieldTouched, errors, touched, values } =
    useFormikContext<{
      [key: string]: any
    }>()
  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <TextAreaInput
        placeholder={placeholder}
        id={id}
        name={name}
        value={props.value || values[name]}
        className={`${
          touched[name as string] &&
          !!errors[name as string] &&
          "!border-mainRed border-2"
        }`}
        onChange={(e) => {
          if (props.value === undefined) {
            // setFieldValueState(e.target.value)
            setFieldValue(name, e.target.value)
          }
        }}
        onBlur={() => {
          setFieldTouched(name as string, true)
        }}
        {...props}
      />

      <FormikError name={name as string} />
    </div>
  )
}
