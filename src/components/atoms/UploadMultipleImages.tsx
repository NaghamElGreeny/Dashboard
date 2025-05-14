import React, { useState, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { useMutate } from '../../hooks/UseMutate';
import showAlert from './ShowAlert';
import ShowAlertMixin from './ShowAlertMixin';
import deleteIcon from '../../../public/assets/images/Trash Bin Trash.png';
import Cookies from 'js-cookie';
import { useIsRTL } from '../../hooks/useIsRTL';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { object } from 'yup';
import { FaRegTrashCan } from 'react-icons/fa6';

const UploadMultipleImages = ({
    acceptFiles = 'image/*',
    name = '',
    type = 'image',
    model = '',
}: {
    acceptFiles?: string;
    name: string;
    model: string;
    type?: 'image' | 'video' | 'file' | 'audio';
}) => {
    const { setFieldValue, values } = useFormikContext<any>();
    const { t } = useTranslation();

    const [images, setImages] = useState<any>([]);
    const [previewImages, setPreviewImages] = useState<any[]>(() => {
        const newPreviewimages = values[name]?.map((image: any) => ({
            name: image?.media, // Handle different image sources
            id: image?.id,
        }));
        return newPreviewimages;
    }); // Initialize as empty array

    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    // Effect to handle the setting of initial images and preview images when form values change
    useEffect(() => {
        if (values[name]) {
            setImages(values[name]);

            const newPreviewImages = values[name]?.map((image: any) => {
                if (typeof image == 'object') {
                    return {
                        name: image?.previewUrl || image?.media || image, // Handle different image sources
                        id: image?.id,
                    };
                } else return { name: image };
            });
            // setPreviewImages(newPreviewImages);
        }
    }, [values, name]);
    const user_token = Cookies.get('token');
    const token = user_token;
    const authorizationHeader = `Bearer ${token}`;
    const isRTL = useIsRTL();
    const baseURL = import.meta.env.VITE_BASE_URL;

    const deletefile = (index: number, id: number) => {
        const newImages = images.filter((_: any, i: number) => i !== index);
        const newPreviewImages = previewImages.filter((_: any, i: number) => i !== index);
        setImages(newImages);
        setPreviewImages(newPreviewImages);
        setFieldValue(name, newImages);

        axios
            .delete(`${baseURL}/delete-attachments/${id}`, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Accept: 'application/json',
                    Authorization: authorizationHeader,
                    'Accept-Language': isRTL ? 'ar' : 'en',
                },
            })
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err.data);
            });
    };
    const { mutate: uploadFile, isLoading } = useMutate({
        general: true,
        mutationKey: ['attachments'],
        endpoint: 'attachments',
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title: data?.data?.message,
            });

            const uploadedImage = { name: data.data.data };
            {
                // Assuming data.data.data is the file name or URL
                // previewUrl: previewImages[previewImages.length - 1], // Last preview image added
            }

            // const newImages = [...images, uploadedImage];
            setImages((prev: any) => {
                setFieldValue(name, [...prev, uploadedImage]);
                return [...prev, uploadedImage];
            });
            // Update Formik values
            setIsUploadingImage(false);
        },
        onError: (err: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'error',
                title: err?.response?.data?.message,
            });
            setIsUploadingImage(false);
        },
        formData: true,
        headers: {
            model: model || 'properties',
            attachment_type: type,
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            Array.from(files).forEach((file) => {
                const allowedTypes = acceptFiles.split(',');

                // Check if file type matches allowed types
                if (!allowedTypes.some((type) => file.type.match(type.trim()))) {
                    showAlert(
                        'Invalid file type. Please select an image',
                        '',
                        false,
                        'ok',
                        true,
                        'error'
                    );
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageUrl = { name: e.target?.result as string };

                    setPreviewImages((prev) => [...prev, imageUrl]); // Add preview image
                };
                reader.readAsDataURL(file);

                const formData = new FormData();
                formData.append('file', file);
                formData.append('attachment_type', 'image');
                formData.append('model', model);

                uploadFile(formData); // Upload the file
                setIsUploadingImage(true);
            });
        }
    };

    const handleRemove = (index: number, id: number) => {
        if (id) {
            showAlert(t('delete_confirmation'), '', false, t('ok'), true, 'warning', () =>
                deletefile(index, id)
            );
        } else {
            const newImages = images.filter((_: any, i: number) => i !== index);
            const newPreviewImages = previewImages.filter((_: any, i: number) => i !== index);
            setImages(newImages);
            setPreviewImages(newPreviewImages);
            setFieldValue(name, newImages);
        }
    };

    const renderFilePreviews = () => {
        if (previewImages && !isUploadingImage && type === 'image') {
            return previewImages?.map((previewImage, index) => (
                <div key={index} className="relative bg-[#F3F0FF] p-2 rounded-xl">
                    <img
                        src={previewImage?.name}
                        className="w-[200px] h-[150px] rounded-xl object-cover"
                        alt="Uploaded"
                    />
                    <button
                        type="button"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemove(index, previewImage?.id)}
                    >
                        <img src={deleteIcon} alt="Delete" />
                    </button>
                </div>
            ));
        } else if (previewImages && !isUploadingImage && type === 'video') {
            return previewImages?.map((previewImage, index) => (
                <div key={index} className="relative bg-[#F3F0FF] p-2 rounded-xl">
                    <video
                        src={previewImage?.name}
                        className="w-[400px] h-[300px] rounded-xl object-cover"
                        controls
                    />
                    <button
                        type="button"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemove(index, previewImage?.id)}
                    >
                        <img className="w-12 h-12" src={deleteIcon} alt="Delete" />
                    </button>
                </div>
            ));
        } else if (previewImages && !isUploadingImage && type === 'audio') {
            return previewImages?.map((previewImage, index) => (
                <div key={index} className="relative bg-[#F3F0FF] p-2 rounded-xl">
                    <audio className="w-[200px] h-[150px] rounded-xl" controls>
                        <source className="w-full h-full" src={previewImage?.name} />
                    </audio>
                    <button
                        type="button"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemove(index, previewImage?.id)}
                    >
                        <img src={deleteIcon} alt="Delete" />
                    </button>
                </div>
            ));
        } else if (previewImages && !isUploadingImage && type === 'file') {
            return previewImages?.map((previewImage, index) => (
                <div key={index} className="relative bg-[#F3F0FF] p-2 rounded-xl">
                    <img
                        src="/path/to/pdf/thumbnail.png" // Placeholder for PDF thumbnail
                        className="w-[200px] h-[150px] rounded-xl object-cover"
                        alt="Uploaded PDF"
                    />
                    <button
                        type="button"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemove(index, previewImage?.id)}
                    >
                        <FaRegTrashCan size={25} className="text-white" />
                    </button>
                </div>
            ));
        }
    };

    return (
        <div className="upload__file-wrapper !flex !flex-col gap-4">
            <div className="w-fit mx-auto flex items-center justify-center border rounded-xl border-dashed border-[#5945aa50] p-5">
                <input
                    type="file"
                    accept={acceptFiles}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id={`file-input-${name}`}
                    multiple
                />
                <label htmlFor={`file-input-${name}`} style={{ cursor: 'pointer' }}>
                    {isUploadingImage || isLoading ? (
                        <div className="w-[200px] h-[150px] flex justify-center items-center">
                            <svg
                                width="64"
                                height="64"
                                viewBox="0 0 135 135"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="#1F4296"
                            >
                                <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                                    <animateTransform
                                        attributeName="transform"
                                        type="rotate"
                                        from="0 67 67"
                                        to="-360 67 67"
                                        dur="2.5s"
                                        repeatCount="indefinite"
                                    />
                                </path>
                                <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
                                    <animateTransform
                                        attributeName="transform"
                                        type="rotate"
                                        from="0 67 67"
                                        to="360 67 67"
                                        dur="2.5s"
                                        repeatCount="indefinite"
                                    />
                                </path>
                            </svg>
                        </div>
                    ) : (
                        <img
                            src="/assets/images/add_photo_alternate_rounded.svg"
                            className="w-[200px] h-[150px]"
                            alt="Upload"
                        />
                    )}
                </label>
            </div>
            {!isLoading && !isUploadingImage && (
                <div className="file-preview-container !flex !flex-wrap gap-4 mt-4">
                    {renderFilePreviews()}
                </div>
            )}
        </div>
    );
};

export default UploadMultipleImages;
