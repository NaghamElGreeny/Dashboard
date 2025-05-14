import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import ShowAlertMixin from './ShowAlertMixin';
import { useTranslation } from 'react-i18next';
import { FaCamera, FaVideo } from 'react-icons/fa';

interface ImagePreview {
    id?: string;
    img_file: File;
    url: string;
    is_upload?: boolean;
}

interface NewUploadMultipleImagesProps {
    label?: string;
    model?: string;
    name?: string;
    type?: 'image' | 'video';
    onChange?: (imageIds: string[]) => void;
    initialImages?: Array<{ id: string; url: string }>;
    acceptFiles?: string;
}

const NewUploadMultipleImages: React.FC<NewUploadMultipleImagesProps> = ({
    label,
    name,
    model,
    type = 'image',
    onChange,
    initialImages = [],
    acceptFiles,
}) => {
    const baseURLGeneral = import.meta.env.VITE_BASE_GENERAL_URL;
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Add console.log to debug initialImages
    console.log('Initial Images received:', initialImages);

    const [images, setImages] = useState<ImagePreview[]>(() => {
        const validImages = initialImages
            .filter((img) => img && img.id && img.url)
            .map((img) => ({
                id: img.id,
                url: img.url,
                is_upload: true,
                img_file: new File([], 'placeholder'),
            }));
        console.log('Processed initial images:', validImages);
        return validImages;
    });

    const { t } = useTranslation();

    useEffect(() => {
        if (initialImages?.length) {
            const validImages = initialImages
                .filter((img) => img && img.id && img.url) // Filter out invalid images
                .map((img) => ({
                    id: img.id,
                    url: img.url,
                    is_upload: true,
                    img_file: new File([], 'placeholder'),
                }));

            setImages(validImages);

            if (onChange) {
                onChange(validImages.map((img) => img.id));
            }
        }
    }, [initialImages]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const selectedFiles = Array.from(e.target.files);
        const newImages = selectedFiles.map((file) => ({
            img_file: file,
            url: URL.createObjectURL(file),
        }));

        setImages((prevImages) => [...prevImages, ...newImages]);

        selectedFiles.forEach(uploadImage);
    };

    const uploadImage = async (image: File) => {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('attachment_type', type);
        formData.append('model', model || '');

        try {
            const response = await axios.post(`${baseURLGeneral}/attachments`, formData);
            const imageId = response.data.data;

            setImages((prevImages) => {
                const updatedImages = prevImages.map((img) =>
                    img.img_file === image ? { ...img, id: imageId, is_upload: true } : img
                );

                if (onChange) {
                    const imageIds = updatedImages
                        .filter((img) => img.id)
                        .map((img) => img.id as string);
                    onChange(imageIds);
                }

                return updatedImages;
            });

            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    response?.data?.message ||
                    t('isCreatedSuccessfully', { name: t('labels.image') }),
            });
        } catch (error: any) {
            ShowAlertMixin({
                type: 15,
                icon: 'error',
                title: error?.response?.data?.message,
            });

            console.error('Error uploading image:', error);
            alert('Error uploading image. Please try again.');
        }
    };

    const deleteImage = async (image: ImagePreview) => {
        if (image.id) {
            try {
                await axios.delete(`${baseURLGeneral}/attachments/${image.id}`);
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        }

        setImages((prevImages) => {
            const updatedImages = prevImages.filter((img) => img.url !== image.url);

            if (onChange) {
                const imageIds = updatedImages
                    .filter((img) => img.id)
                    .map((img) => img.id as string);
                onChange(imageIds);
            }

            return updatedImages;
        });
    };

    return (
        <div className="mb-4">
            {/* Upload Input */}
            <div
                className="relative text-center cursor-pointer mx-auto w-[300px] mb-4"
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="relative w-full h-[150px] bg-[#EEEEEE] flex flex-col justify-center items-center rounded-2xl transition-all duration-200 hover:bg-gray-300">
                    <span className="text-gray-800 font-semibold">{label}</span>
                    <div className="flex gap-2 text-xl text-gray-600">
                        {type === 'video' ? (
                            <>
                                <FaVideo />
                                <FaVideo />
                                <FaVideo />
                            </>
                        ) : (
                            <>
                                <FaCamera />
                                <FaCamera />
                                <FaCamera />
                            </>
                        )}
                    </div>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={acceptFiles || (type === 'video' ? 'video/*' : 'image/*')}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                />
                <div className="absolute inset-0 w-full h-full bg-black/50 rounded-2xl flex justify-center items-center opacity-0 transition-all duration-200 hover:opacity-100"></div>
            </div>

            {/* Preview */}
            {images.length > 0 && (
                <div className="flex items-center overflow-x-auto gap-4 space-x-3 py-2">
                    {images.map((img) => (
                        <div key={img.url} className="relative flex-shrink-0">
                            <span
                                className="absolute top-2 right-2 bg-white text-red-500 font-medium w-6 h-6 rounded-full flex justify-center items-center cursor-pointer"
                                onClick={() => deleteImage(img)}
                            >
                                X
                            </span>

                            {type === 'video' ? (
                                <video
                                    src={img.url}
                                    className="w-[150px] h-[150px] object-cover rounded-lg shadow-md"
                                    controls
                                />
                            ) : (
                                <img
                                    src={img.url}
                                    alt="Preview"
                                    className="w-[150px] h-[150px] object-cover rounded-lg shadow-md"
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NewUploadMultipleImages;
