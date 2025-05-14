import axios from 'axios';
import { useFormikContext } from 'formik';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutate } from '../../hooks/UseMutate';
import showAlert from './ShowAlert';
import ShowAlertMixin from './ShowAlertMixin';
import deleteIcon from '/assets/images/Trash Bin Trash.png';

interface Props {
    acceptFiles?: string;
    name: string;
    model?: string;
    initialVideos?: { id: number; media: string }[]; // Ensure correct type for initialVideos
    refetch?: () => void; // 🔥 Ensure refetch is typed as a function
}

const NewUploadMultipleVideoRepeaterAttachment: React.FC<Props> = ({
    acceptFiles = 'video/*',
    name = '',
    model = '',
    initialVideos = [],
    refetch,
}) => {
    const { setFieldValue, values } = useFormikContext<any>();
    const { t, i18n } = useTranslation();
    const [videos, setVideos] = useState(values[name] || []);
    const [previewVideo, setPreviewVideo] = useState<any[]>([]);
    const [isUploadingVideo, setIsUploadingVideo] = useState(false);

    useEffect(() => {
        if (Array.isArray(values[name]) && values[name].length > 0) {
            setVideos(values[name]);
        } else if (Array.isArray(initialVideos) && initialVideos.length > 0) {
            setVideos(initialVideos); // 🔥 Use `initialVideos` if `values[name]` is empty
        } else {
            setVideos([]);
        }

        const previewMedia = (values[name] || initialVideos).map((video: any) => ({
            name: video?.media || video?.previewUrl || video,
            id: video?.id,
        }));

        setPreviewVideo(previewMedia);
    }, [values, name, initialVideos]);

    const { mutate: uploadFile, isLoading } = useMutate({
        general: true,
        mutationKey: ['attachments'],
        endpoint: 'attachments',
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title: t('isCreatedSuccessfully', { name: t('labels.video') }),
            });

            const uploadedVideo = {
                name: data.data.data,
                previewUrl: previewVideo[previewVideo.length - 1], // Last preview video added
            };

            const newVideo = [...videos, uploadedVideo];
            setVideos(newVideo);
            setFieldValue(`${name}`, newVideo);
            setIsUploadingVideo(false);

            refetch && refetch();
        },
        onError: (err: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'error',
                title: err?.response?.data?.message,
            });
            setIsUploadingVideo(false);
        },
        formData: true,
        headers: {
            model: model || 'products',
            attachment_type: 'video',
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            Array.from(files).forEach((file) => {
                const allowedTypes = acceptFiles.split(',');

                if (!allowedTypes.some((type) => file.type.match(type.trim()))) {
                    showAlert(
                        'Invalid file type. Please select an video',
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
                    const videoUrl = e.target?.result as string;
                    setPreviewVideo((prev) => [...prev, videoUrl]);
                };
                reader.readAsDataURL(file);

                const formData = new FormData();
                formData.append('file', file);
                formData.append('attachment_type', 'video');
                formData.append('model', model || 'products');

                uploadFile(formData);
                setIsUploadingVideo(true);
            });
        }
    };

    const baseURLGeneral = import.meta.env.VITE_BASE_GENERAL_URL;
    const user_token = Cookies.get('token');
    const token = user_token;
    const authorizationHeader = `Bearer ${token}`;

    const deleteFile = (index: number, id: number) => {
        const newVideo = videos.filter((_: any, i: number) => i !== index);
        const newPreviewVideo = previewVideo.filter((_: any, i: number) => i !== index);
        setVideos(newVideo);
        setPreviewVideo(newPreviewVideo);
        setFieldValue(`${name}`, newVideo);
        axios
            .delete(`${baseURLGeneral}/attachments/${id}`, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Accept: 'application/json',
                    Authorization: authorizationHeader,
                    'Accept-Language': i18n.language,
                },
            })
            .then((res) => {
                refetch && refetch();
                ShowAlertMixin({
                    type: 15,
                    icon: 'success',
                    title:
                        res?.data?.message ||
                        t('isDeletedSuccessfully', { name: t('labels.video') }),
                });
            })
            .catch((err) => {
                console.log(err.data);

                showAlert(err?.response?.data?.message, '', false, t('ok'), true, 'error');
            });
    };

    const handleRemove = (index: number, id: number) => {
        if (id) {
            showAlert(t('delete_confirmation'), '', false, t('ok'), true, 'warning', () =>
                deleteFile(index, id)
            );
        } else {
            const newVideo = videos.filter((_: any, i: number) => i !== index);
            const newPreviewVideo = previewVideo.filter((_: any, i: number) => i !== index);
            setVideos(newVideo);
            setPreviewVideo(newPreviewVideo);
            setFieldValue(`${name}`, newVideo);
        }
    };

    // const handleRemove = (index: number) => {
    //     const newImages = images.filter((_: any, i: number) => i !== index);
    //     const newPreviewImages = previewImages.filter((_: any, i: number) => i !== index);
    //     setImages(newImages);
    //     setPreviewImages(newPreviewImages);
    //     setFieldValue(name, newImages);
    // };

    // const handleRemove = (index: number, id: number) => {
    //     if (id) {
    //         showAlert(t('delete_confirmation'), '', false, t('ok'), true, 'warning', () =>
    //             deleteFile(index, id)
    //         );
    //     } else {
    //         const newImages = images.filter((_: any, i: number) => i !== index);
    //         const newPreviewImages = previewImages.filter((_: any, i: number) => i !== index);
    //         setImages(newImages);
    //         setPreviewImages(newPreviewImages);
    //         setFieldValue(name, newImages);
    //     }
    //     // Update Formik field value
    // };

    const renderFilePreviews = () => {
        return (
            <div className="flex flex-wrap gap-4">
                {previewVideo.map((previewVideo, index) => (
                    <div
                        key={index}
                        className="relative inline-flex flex-wrap bg-[#F3F0FF] p-2 rounded-xl"
                    >
                        <video
                            src={previewVideo?.name}
                            className="w-[300px] h-[200px] rounded-xl object-cover"
                            controls
                        />
                        <button
                            type="button"
                            className="absolute top-2 right-2"
                            onClick={() => handleRemove(index, previewVideo?.id)}
                        >
                            <img className="w-8 h-8" src={deleteIcon} alt="Delete" />
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="upload__file-wrapper !flex !flex-col gap-4">
            <div className="flex items-center justify-center border rounded-xl border-dashed border-[#5945aa50] p-5 w-fit mx-auto">
                <input
                    type="file"
                    accept={acceptFiles}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id={`file-input-${name}`}
                />
                <label htmlFor={`file-input-${name}`} style={{ cursor: 'pointer' }}>
                    {isUploadingVideo ? (
                        <div className="w-[200px] h-[150px] flex justify-center items-center">
                            <svg
                                width="64"
                                height="64"
                                viewBox="0 0 135 135"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="#4361ee"
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
                                        dur="8s"
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
            {!isUploadingVideo && (
                <div className="relative file-item w-full flex flex-wrap items-center gap-2 p-1 rounded-xl">
                    {renderFilePreviews()}
                </div>
            )}
        </div>
    );
};

export default NewUploadMultipleVideoRepeaterAttachment;
