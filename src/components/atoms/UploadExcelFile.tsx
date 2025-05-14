import React from 'react';
import { useFormikContext } from 'formik';
import { MdCancel } from 'react-icons/md';
import CloudUpload from './icons/CloudUpload';
import File from './icons/File';
import { useTranslation } from 'react-i18next';

const UploadExcelFile = ({ name, className, acceptType }: any) => {
    const { setFieldValue, values } = useFormikContext(); // Assuming your formik context is properly typed, otherwise use <any>
    const [fileName, setFileName] = React.useState(''); // To display the file name

    const { t } = useTranslation();

    const handleFileChange = (event: any) => {
        if (event.target.files[0]) {
            setFieldValue(name, event.target.files[0]); // Update formik state with the file object
            setFileName(event.target.files[0].name); // Update local state with the file name for display
        }
    };

    // Optional: handle file removal
    const handleRemoveFile = () => {
        setFieldValue(name, null); // Clear the file from formik state
        setFileName(''); // Clear the file name from local state
    };

    // Function to format fileName to display
    const formatFileName = (fileName: any) => {
        // Extract the file extension
        const extension = fileName.slice(fileName.lastIndexOf('.'));
        // Get the main part of the fileName without the extension
        const mainPart = fileName.slice(0, fileName.lastIndexOf('.'));
        // Check if the main part of the name exceeds 20 characters
        if (mainPart.length > 20) {
            // Return the first 20 characters and append '...' and the extension
            return `${mainPart.slice(0, 20)}***${extension}`;
        }
        // Return the fileName as is if it doesn't exceed 20 characters in the main part
        return fileName;
    };

    return (
        <div
            className={`upload__image-wrapper relative w-fit grid grid-cols-3 items-center ${className}`}
        >
            <input
                type="file"
                accept={acceptType}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="fileInput"
            />
            <label
                htmlFor="fileInput"
                className="flex items-center justify-center border rounded-xl border-dashed border-[#5945aa50] p-1  bg-[#F3F0FF] w-max pr-5 cursor-pointer gap-2"
            >
                <div className="bg-[#5A45AA] p-2 rounded-xl">
                    <CloudUpload />
                </div>
                <div className="text-start ">
                    <p className="text-[13px]">{t('Select Excel File')}</p>
                    <p className="text-[13px]"> ( xlsx, xls, xlsm, csv )</p>
                </div>
            </label>
            {fileName && (
                <div className="flex gap-1 mx-2">
                    <div className="w-full border rounded-xl border-solid border-[#5A45AA] relative">
                        <div className="image-item w-full flex items-center gap-2 p-1 py-2 rounded-xl">
                            <div className="bg-[#F3F0FF] p-2 rounded-xl">
                                <File />
                            </div>
                            <div className="text-start"> {formatFileName(fileName)}</div>
                            <button
                                type="button"
                                onClick={handleRemoveFile}
                                className="absolute top-1 right-1 text-red-500 font-bold"
                            >
                                <MdCancel />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadExcelFile;
