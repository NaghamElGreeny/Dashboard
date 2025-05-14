import { useFormikContext } from 'formik';
import { useEffect } from 'react';
import { FormikError } from '../../atoms';
import { Checkbox } from '../Checkbox';

// props type
type Props_TP = {
    editData?: any | undefined;
    [key: string]: any;
};

export const CheckBoxField = ({
    label,
    id,
    name,
    editData,
    ...props
}: { label: string; name: string } & Props_TP) => {
    const { setFieldValue, setFieldTouched, errors, values } = useFormikContext<{
        [key: string]: any;
    }>();

    //  useEffect(() => {
    //   if(!!editData){
    //     editData?.permissions?.map(permission=>{
    //        setFieldValue(permission.id , true)
    //     })
    //   }
    //  }, [JSON.stringify(editData)])

    return (
        <div>
            <Checkbox
                label={label}
                id={id}
                // value={props.value || values[props.name]}
                value={values[name] || values.value}
                className={`${errors[name] && 'border-2 border-mainRed'}`}
                {...props}
                checked={values[name]}
                onChange={(e) => {
                    setFieldValue(name, e.target.checked ? 1 : 0);
                }}
                onBlur={() => {
                    setFieldTouched(name, true);
                }}
            />
            <FormikError name={name} />
        </div>
    );
};
