import { useFormikContext } from 'formik';
import React from 'react';
import { MdCancel } from 'react-icons/md';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import CloudUpload from './icons/CloudUpload';
import File from './icons/File';
import { useTranslation } from 'react-i18next';

const UploadImg = ({ name, className, hideTypeImage }: any) => {
    const { setFieldValue, values } = useFormikContext<any>(); /////////// STATES
    const dataUpdate = [{ name: values[name] }];
    const [images, setImages] = React.useState(values[name] ? dataUpdate : []);
    const maxNumber = 69;
    const { t } = useTranslation();
    const onChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
        setImages(imageList as never[]);
        setFieldValue(name, imageList[0]?.file);
    };
    return (
        <ImageUploading value={images} onChange={onChange} maxNumber={maxNumber}>
            {({ imageList, onImageUpload, onImageRemove, isDragging, dragProps }) => (
                // write your building UI
                <div
                    className={`upload__image-wrapper  relative  w-fit grid grid-cols-1 md:grid-cols-3 items-center  ${className}`}
                >
                    <div className=" flex  items-center justify-center  border rounded-xl   border-dashed border-[#5945aa50]">
                        <div className="p-1  w-full  bg-[#F3F0FF] dark:!bg-[#0e1726] rounded-xl pr-5">
                            <button
                                type="button"
                                style={isDragging ? { color: 'red' } : undefined}
                                onClick={onImageUpload}
                                className="flex items-center gap-2"
                                {...dragProps}
                            >
                                <div className="bg-[#5A45AA] p-2 rounded-xl">
                                    <CloudUpload />
                                </div>
                                <div className="text-start">
                                    <p className="text-[13px]"> {t('Select Image')}</p>
                                    <p className="text-[13px]">JPG, GIF, PNG,SVG,PMP</p>
                                </div>
                            </button>
                        </div>
                    </div>
                    {imageList.map((image, index) => (
                        <div className="mx-2 flex  gap-1 ">
                            <div className=" w-full  border rounded-xl  border-solid border-[#5A45AA] relative">
                                <div
                                    key={index}
                                    className="image-item w-full flex items-center gap-2 p-1  rounded-xl"
                                >
                                    <div className="bg-[#F3F0FF] p-2 rounded-xl">
                                        {image.dataURL ? (
                                            <img
                                                src={image.dataURL}
                                                className="w-[18px] h-[22px]"
                                            />
                                        ) : (
                                            <File />
                                        )}
                                    </div>
                                    <div className="text-start">
                                        <p className="text-[13px]">
                                            {image?.file?.name?.slice(0, 13)}...
                                        </p>
                                        {!hideTypeImage && (
                                            <p className="text-[13px]">JPG, GIF, PNG,SVG,PMP</p>
                                        )}
                                    </div>
                                    <div className="absolute top-1 rounded-xl right-1  ">
                                        <button
                                            type="button"
                                            onClick={() => onImageRemove(index)}
                                            className="text-red-500 font-bold"
                                        >
                                            <MdCancel />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ImageUploading>
    );
};

export default UploadImg;
