import { useFormikContext } from 'formik';
import React from 'react';
import { MdCancel } from 'react-icons/md';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import CloudUpload from './icons/CloudUpload';
import File from './icons/File';
import { useTranslation } from 'react-i18next';
import ShowAlertMixin from './ShowAlertMixin';
import { useMutate } from '../../hooks/UseMutate';

const UploadImgCustom = ({ name, className, hideTypeImage, typeImage, acceptType, model }: any) => {
    const { setFieldValue, values } = useFormikContext<any>(); /////////// STATES

    const dataUpdate = [{ name: values[name] }];
    const [images, setImages] = React.useState(values[name] ? dataUpdate : []);
    const [isUploadingImage, setIsUploadingImage] = React.useState([]);
    const maxNumber = 69;
    const { t } = useTranslation();

    const { mutate: uploadFile, isLoading } = useMutate({
        general: true,
        mutationKey: [`attachments`],
        endpoint: `attachments`,
        onSuccess: (data: any) => {
            const fileData = data?.data?.data;
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title: data?.data?.message,
            });

            setImages(isUploadingImage);
            setFieldValue(name, fileData);
        },
        onError: (err: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'error',
                title: err?.response?.data?.message,
            });
        },
        formData: true,
        headers: {
            model: model || 'properties',
            attachment_type: 'file',
        },
    });

    const onChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
        setIsUploadingImage(imageList as never[]);
        setFieldValue(name, imageList[0]?.file);

        uploadFile({
            file: imageList[0]?.file,
            model: model || 'properties',
            attachment_type: 'file',
        });
    };
    return (
        <ImageUploading
            value={images}
            onChange={onChange}
            maxNumber={maxNumber}
            acceptType={acceptType}
        >
            {({ imageList, onImageUpload, onImageRemove, isDragging, dragProps }) => (
                // write your building UI
                <div
                    className={`upload__image-wrapper  relative  w-fit grid  grid-cols-1 md:grid-cols-3 items-center  ${className}`}
                >
                    <div className=" flex  items-center justify-center  border rounded-xl   border-dashed border-[#5945aa50]">
                        <div className="p-1  w-full  bg-[#F3F0FF] rounded-xl dark:!bg-[#0e1726] pr-5">
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
                                    <p className="text-[13px]">{t('Select Image')}</p>
                                    <p className="text-[13px]">
                                        {typeImage ? typeImage : 'JPG, GIF, PNG,SVG,PMP'}
                                    </p>
                                </div>
                            </button>
                        </div>
                    </div>
                    {imageList.map((image, index) => (
                        <>
                            {image.dataURL ? (
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
                                                    <p className="text-[13px]">
                                                        JPG, GIF, PNG,SVG,PMP
                                                    </p>
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
                            ) : (
                                <div className="mx-2 flex  gap-1 ">
                                    <div className=" w-full  border rounded-xl  border-solid border-[#5A45AA] relative">
                                        <div
                                            key={index}
                                            className="image-item w-full flex items-center gap-2 p-1  rounded-xl"
                                        >
                                            <div className="bg-[#F3F0FF] p-2 rounded-xl">
                                                {image?.name.path || image?.name ? (
                                                    <img
                                                        src={image?.name.path || image?.name}
                                                        className="w-[18px] h-[22px]"
                                                    />
                                                ) : (
                                                    <File />
                                                )}
                                            </div>
                                            <div className="text-start">
                                                <p className="text-[13px]">
                                                    {image?.name.path?.slice(13, 23) ||
                                                        image?.name?.slice(13, 23)}{' '}
                                                    ...
                                                </p>
                                                {!hideTypeImage && (
                                                    <p className="text-[13px]">
                                                        JPG, GIF, PNG,SVG,PMP
                                                    </p>
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
                            )}
                        </>
                    ))}
                </div>
            )}
        </ImageUploading>
    );
};

export default UploadImgCustom;
