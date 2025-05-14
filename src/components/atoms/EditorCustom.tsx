import { useFormikContext } from 'formik';
import { useState } from 'react';
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';
import { Label } from './Label';

type Editor_TP = {
    label?: string;
    placeholder?: string;
    description?: string;
    error?: string;
    className?: string;
    id?: any;

    type?: string;
    handleChange?: any;
    value?: any;
    name?: any;
};
const modules = {
    toolbar: [
        [{ header: '1' }, { header: '2' }, { header: '3' }, { font: [] }],
        [{ size: [] }],

        // [{ font: ['serif', 'sans-serif', 'monospace'] }], // Font family
        // [{ size: ['small', false, 'large', 'huge'] }], // Font sizes

        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link'],
        [{ color: [] }], // Add red and blue to the color palette
        ['clean'],
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    },
};

const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'color',
];

function CKeditor({
    label,
    id,
    placeholder,
    description,
    error,
    className,
    name,
    type,
    handleChange,
    ...props
}: Editor_TP) {
    const { setFieldValue, setFieldTouched, errors, touched, values } = useFormikContext<{
        [key: string]: any;
    }>();

    const [value, setValue] = useState('');
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <Label htmlFor={id} className="mb-1">
                    {label}
                </Label>
            )}
            <ReactQuill
                //   id={name}
                placeholder={placeholder}
                value={values[name]}
                // value={value}
                onChange={(value) => {
                    setFieldValue(name, value);
                }}
                onBlur={() => setFieldTouched(name, true)}
                theme="snow"
                modules={modules}
                formats={formats}
            />

            {touched[name] && errors[name] && typeof errors[name] === 'string' && (
                <div className="text-red-500 text-sm ">{errors[name] as string}</div>
            )}
        </div>
    );
}

export default CKeditor;
