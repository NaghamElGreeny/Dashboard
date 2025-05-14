import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import ShowAlertMixin from './ShowAlertMixin';
import { useTranslation } from 'react-i18next';
import { FaCamera, FaVideo } from 'react-icons/fa';
import Cookies from 'js-cookie';
import showAlert from './ShowAlert';

interface ImagePreview {
    id?: string;
    img_file: File;
    url: string;
    is_upload?: boolean;
    isLoading?: boolean;
    image?: string;
    media?: string;
}

interface MultipleAttachmentsUploadProps {
    label?: string;
    model?: string;
    name?: string;
    type?: 'image' | 'video';
    onChange?: (attachmentIds: string[]) => void;
    initialValues?: Array<{ id: string; url: string }>;
    acceptFiles?: string;
    refetch?: () => void;
}

const MultipleAttachmentsUpload: React.FC<MultipleAttachmentsUploadProps> = ({
    label,
    name,
    model,
    type = 'image',
    onChange,
    initialValues = [],
    acceptFiles = 'image/png, image/jpeg',
    refetch,
}) => {
    const { t, i18n } = useTranslation();
    const baseURLGeneral = import.meta.env.VITE_BASE_GENERAL_URL;
    const user_token = Cookies.get('token');
    const token = user_token;
    const authorizationHeader = `Bearer ${token}`;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [attachments, setAttachments] = useState<ImagePreview[]>(() => {
        const validAttachments = initialValues
            .filter((attach) => attach && attach.id && attach.url)
            .map((attach) => ({
                id: attach.id,
                url: attach.url,
                is_upload: true,
                img_file: new File([], 'placeholder'),
                isLoading: false,
            }));
        return validAttachments;
    });

    useEffect(() => {
        if (initialValues?.length) {
            const validAttachments = initialValues
                .filter((img) => img && img.id && img.url) // Filter out invalid files
                .map((img) => ({
                    id: img.id,
                    url: img.url,
                    is_upload: true,
                    img_file: new File([], 'placeholder'),
                    isLoading: false,
                }));

            setAttachments(validAttachments);

            if (onChange) {
                onChange(validAttachments.map((img) => img.id));
            }
        }
    }, [initialValues]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const selectedFiles = Array.from(e.target.files);
        const newImages = selectedFiles.map((file) => ({
            img_file: file,
            url: URL.createObjectURL(file),
            isLoading: true,
        }));

        setAttachments((prevImages) => [...prevImages, ...newImages]);

        selectedFiles.forEach(uploadImage);
    };

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('attachment_type', type);
        formData.append('model', model || '');

        try {
            const response = await axios.post(`${baseURLGeneral}/upload-media`, formData, {
                headers: {
                    Authorization: authorizationHeader,
                    'Accept-Language': i18n.language,
                },
            });
            const fileData = response.data.data;

            setAttachments((prevImages) => {
                const updatedAttachments = prevImages.map((img) =>
                    img.img_file === file
                        ? {
                              ...img,
                              image: fileData,
                              media: fileData,
                              is_upload: true,
                              isLoading: false,
                          }
                        : img
                );

                if (onChange) {
                    const fileData = updatedAttachments
                        .filter((img) => img.image || img.media)
                        .map((img) => (type === 'video' ? img.media : img.image));
                    onChange(fileData);
                }

                return updatedAttachments;
            });

            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    response?.data?.message ||
                    t('isCreatedSuccessfully', { name: t('labels.attachment') }),
            });
        } catch (error: any) {
            ShowAlertMixin({
                type: 15,
                icon: 'error',
                title: error?.response?.data?.message,
            });
        }
    };

    const handleRemove = (file: ImagePreview) => {
        if (file.id) {
            showAlert(t('delete_confirmation'), '', false, t('ok'), true, 'warning', () =>
                deleteFile(file)
            );
        } else {
            setAttachments((prevImages) => {
                const updatedAttachments = prevImages.filter((img) => img.url !== file.url);

                if (onChange) {
                    const attachmentIds = updatedAttachments
                        .filter((img) => img.id)
                        .map((img) => img.id as string);
                    onChange(attachmentIds);
                }

                return updatedAttachments;
            });
        }
    };

    const deleteFile = async (file: ImagePreview) => {
        if (file.id) {
            try {
                await axios
                    .delete(`${baseURLGeneral}/delete-attachments/${file.id}`, {
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            Accept: 'application/json',
                            Authorization: authorizationHeader,
                            'Accept-Language': i18n.language,
                        },
                    })
                    .then((res) => {
                        // console.log(refetch,'ddd')
                        refetch && refetch();

                        ShowAlertMixin({
                            type: 15,
                            icon: 'success',
                            title:
                                res?.data?.message ||
                                t('isDeletedSuccessfully', { name: t('labels.attachment') }),
                        });
                    });
            } catch (error: any) {
                ShowAlertMixin({
                    type: 15,
                    icon: 'error',
                    title: error?.response?.data?.message,
                });
            }
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="mb-4">
            {/* Upload Input */}
            <div
                className="relative text-center cursor-pointer mx-auto w-[300px] mb-4 group"
                onClick={handleClick}
            >
                <div className="relative w-full h-[150px] bg-[#f2f4ff] dark:bg-black flex flex-col justify-center items-center rounded-2xl transition-all duration-300 group-hover:from-blue-100 group-hover:to-purple-100 border-2 border-dashed border-gray-300">
                    <span className="text-gray-800 dark:text-white-dark font-semibold mb-3">
                        {label}
                    </span>
                    <div className="flex gap-3 text-2xl text-gray-600">
                        {type === 'video' ? (
                            <>
                                <FaVideo className="transform transition-transform group-hover:scale-110 group-hover:text-secondary" />
                                <FaVideo className="transform transition-transform group-hover:scale-110 group-hover:text-secondary" />
                                <FaVideo className="transform transition-transform group-hover:scale-110 group-hover:text-secondary" />
                            </>
                        ) : (
                            <>
                                <FaCamera className="transform transition-transform group-hover:scale-110 group-hover:text-secondary" />
                                <FaCamera className="transform transition-transform group-hover:scale-110 group-hover:text-secondary" />
                                <FaCamera className="transform transition-transform group-hover:scale-110 group-hover:text-secondary" />
                            </>
                        )}
                    </div>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={acceptFiles}
                    className="hidden"
                    onChange={handleImageChange}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>

            {/* Preview */}
            {attachments.length > 0 && (
                <div className="flex items-center overflow-x-auto gap-4 space-x-3 py-2">
                    {attachments.map((attach: any) => (
                        <div key={attach.url} className="relative flex-shrink-0">
                            <span
                                className="absolute top-2 right-2 bg-white text-red-500 font-medium w-6 h-6 rounded-full flex justify-center items-center cursor-pointer z-10"
                                onClick={() => handleRemove(attach)}
                            >
                                X
                            </span>

                            <div className="relative">
                                {attach.isLoading && (
                                    <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}

                                {type === 'video' ? (
                                    <video
                                        src={attach.url}
                                        className="w-[150px] h-[150px] object-cover rounded-lg shadow-md"
                                        controls
                                    />
                                ) : (
                                    <img
                                        src={attach.url}
                                        alt="Preview"
                                        className="w-[150px] h-[150px] object-cover rounded-lg shadow-md"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultipleAttachmentsUpload;
