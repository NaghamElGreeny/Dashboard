import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutate } from '../../hooks/UseMutate';
import showAlert from './ShowAlert';
import ModalCustom from '../template/modal/ModalCustom';
import { Loader } from '@mantine/core';
import deleteIcon from '/assets/images/Trash Bin Trash.png';
import ShowAlertMixin from './ShowAlertMixin';

const UploadImageProductRepeater = ({
    showOnly,
    name,
    oldValues,
    imagePath,
    //this is the key used to remove image from endpoint or delete locally
    deleteImageById,
    showpropertie,
    className,
    onUploadSuccess,
    onRemove,
    index,
    isNew,
    acceptFiles,
    showAddImage,
    model,
}: any) => {
    const [fileUrl, setFileUrl] = useState(imagePath || '');
    const [localFileUrl, setLocalFileUrl] = useState('');
    const { values, setFieldValue } = useFormikContext<any>();
    const { t } = useTranslation();
    const [modalOpen, setModalOpen] = useState(false);
    const images = Array.isArray(values.images) ? values.images : [];
    const addInput = () => {
        setFieldValue('images', [
            ...images,
            {
                id: Date.now(),
                image: '',
                showImage: '',
                is_main: 0,
                ar: { alt: '' },
                en: { alt: '' },
                isNew: true,
            },
        ]);
    };

    const {
        mutate: uploadFile,
        isLoading,
        isSuccess,
    } = useMutate({
        general: true,
        mutationKey: [`attachments`],
        endpoint: `attachments`,
        onSuccess: (data: any) => {
            // console.log('test', data?.data?.data);
            const fileData = data?.data?.data;
            showAlert(data?.data?.message, '', false, t('ok'), true, 'success');
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message || t('isCreatedSuccessfully', { name: t('labels.image') }),
            });
            setFileUrl(fileData); // Set the uploaded file URL
            onUploadSuccess(fileData, index); // Call onUploadSuccess with the new file
        },
        onError: (err: any) => {
            showAlert(err?.response?.data?.message, '', false, t('ok'), true, 'error');
        },
        formData: true,
        headers: {
            model: model || 'products',
            attachment_type: 'image',
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const allowedTypes = acceptFiles ? acceptFiles.split(',') : ['image/*'];

            if (!allowedTypes.some((type: any) => file.type.match(type.trim()))) {
                showAlert(t('invalid_image'), '', false, t('ok'), true, 'error');
                return;
            }

            const localUrl = URL.createObjectURL(file);
            setLocalFileUrl(localUrl);

            uploadFile({
                file: file,
                model: model || 'product',
                attachment_type: 'image',
            });
        }
    };

    const renderFilePreview = () => {
        const imageUrlToShow = localFileUrl || fileUrl;

        return (
            <div className="bg-[#F3F0FF] p-2 rounded-xl">
                {isLoading && !isSuccess ? (
                    <div className="w-[200px] h-[150px] flex justify-center items-center">
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 135 135"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#000000"
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
                    <img src={imageUrlToShow} className="w-[200px] h-[150px]" alt="Uploaded" />
                )}
            </div>
        );
    };

    return (
        <div className={`upload__file-wrapper ${className}`}>
            {!fileUrl && !localFileUrl && (
                <div className="flex items-center justify-center border rounded-xl border-dashed border-[#5945aa50] p-5">
                    <input
                        type="file"
                        accept={acceptFiles || 'image/*'}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id={`file-input-${index}`}
                    />
                    <label htmlFor={`file-input-${index}`} style={{ cursor: 'pointer' }}>
                        {isLoading ? (
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
            )}
            {fileUrl || localFileUrl ? (
                <div className="relative file-item w-full flex flex-col items-center gap-2 p-1 rounded-xl">
                    {renderFilePreview()}
                    <button
                        disabled={showOnly}
                        type="button"
                        className="absolute top-2 right-2"
                        onClick={() => {
                            if (!deleteImageById) {
                                setFileUrl('');
                                setLocalFileUrl('');
                            }

                            onRemove(index);
                        }}
                    >
                        <img src={deleteIcon} alt="Delete" />
                    </button>

                    {/* <button
                        type="button"
                        className="mt-2 text-red-500"
                        disabled={showOnly}
                        onClick={() => {
                            setFileUrl('');
                            setLocalFileUrl('');
                            onRemove(index);
                        }}
                    >
                        {t('Change File')}
                    </button> */}
                </div>
            ) : null}

            <ModalCustom opened={modalOpen} setOpen={setModalOpen} title={t('View PDF')}>
                <iframe
                    src={fileUrl}
                    width="100%"
                    height="500px"
                    style={{ border: 'none' }}
                    title="PDF Viewer"
                />
            </ModalCustom>
        </div>
    );
};

export default UploadImageProductRepeater;
