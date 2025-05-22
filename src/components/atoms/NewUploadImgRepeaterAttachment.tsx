import React, { useState, useEffect } from 'react';
import { getIn, useFormikContext } from 'formik';
import { useMutate } from '../../hooks/UseMutate';
import ModalCustom from '../template/modal/ModalCustom';
import showAlert from './ShowAlert';
import ShowAlertMixin from './ShowAlertMixin';
import deleteIcon from '/assets/images/Trash Bin Trash.png';
import imageError from '/assets/images/logo.png';

const NewUploadImgRepeaterAttachment = ({
    acceptFiles = 'image/*',
    name = '',
    model = '',
    type = 'image',
    isBinary = false,
}) => {
    // Access formik context
    const { setFieldValue, setFieldTouched, errors, touched, values } = useFormikContext<any>();

    // Initialize states based on form values
    const dataUpdate = [{ name: values[name] }];
    const [images, setImages] = useState(values[name] ? dataUpdate : []);
    // عشان تقرا الname
    const slectedValue = getIn(values, name) || values[name] || ''
    const [previewImage, setPreviewImage] = useState(slectedValue);

    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const [imageFileUpload, setImageFileUpload] = useState(null);

    useEffect(() => {
        if (values[name]) {
            setImages(dataUpdate);
        }
    }, [values, name]);

    const { mutate: uploadFile, isLoading } = useMutate({
        general: true,
        mutationKey: ['attachment'],
        endpoint: 'attachment',
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title: data?.data?.message,
            });




            setImageFileUpload(data.data?.path);

            setImages([{ name: previewImage }]);
            setFieldValue(name, data.data?.path);
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
            model: model,
            attachment_type: type,
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const allowedTypes = acceptFiles.split(',');

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

            if (isBinary) {
                // Handle binary data upload
                reader.onload = (e) => {
                    const binaryData = e.target?.result;
                    setFieldValue(name, binaryData); // Store binary data in formik field
                    setPreviewImage(URL.createObjectURL(file)); // Preview the image
                };
                reader.readAsArrayBuffer(file); // Read as binary
            } else {
                // Regular upload via uploadFile function
                reader.onload = (e) => {
                    const imageUrl = e.target?.result as string;
                    setPreviewImage(imageUrl);
                };
                reader.readAsDataURL(file);

                const formData = new FormData();
                formData.append('file', file);
                formData.append('attachment_type', type);
                formData.append('model', model);

                uploadFile(formData); // Only upload when isBinary is false
                setIsUploadingImage(true);
            }
        }
    };

    const handleRemove = () => {
        setImages([]);
        setPreviewImage(null);
        setFieldValue(name, '');
        setIsUploadingImage(false);
    };

    const renderFilePreview = () => {
        if (previewImage && type === 'file' && !isUploadingImage) {
            return (
                <div
                    className="relative bg-[#F3F0FF] p-2 rounded-xl m-auto w-[200px] h-[150px] flex items-center justify-center hover:cursor-pointer"
                    onClick={() => setModalOpen(true)}
                >
                    <img
                        src="/assets/images/pdfimage.png"
                        className="object-cover w-full h-full absolute left-0 top-0 rounded-xl"
                        alt="Uploaded"
                    />
                    <span className="text-[#b30b00] z-10 bg-white p-4 rounded-xl font-bold shadow-2xl">
                        View PDF
                    </span>
                    <button
                        type="button"
                        className="absolute top-3 right-3 bg-white p-1 w-7 h-7 rounded-full"
                        onClick={handleRemove}
                    >
                        <img src={deleteIcon} alt="Delete" />
                    </button>
                </div>
            );
        } else if (previewImage && !isUploadingImage && type === 'video') {
            return (
                <div className="relative bg-[#F3F0FF] p-2 rounded-xl">
                    <video
                        className="w-[200px] h-[150px] rounded-xl object-cover"
                        autoPlay
                        controls
                    >
                        <source className="w-full h-full" src={previewImage} />
                    </video>
                    <button
                        type="button"
                        className="absolute top-3 right-3 bg-white p-1 w-7 h-7 rounded-full"
                        onClick={handleRemove}
                    >
                        <img src={deleteIcon} alt="Delete" />
                    </button>
                </div>
            );
        } else if (previewImage && !isUploadingImage && type === 'audio') {
            return (
                <div className="relative bg-[#F3F0FF] p-2 rounded-xl">
                    <audio className="w-[200px] h-[150px] rounded-xl" controls>
                        <source className="w-full h-full" src={previewImage} />
                    </audio>
                    <button
                        type="button"
                        className="absolute top-3 right-3 bg-white p-1 w-7 h-7 rounded-full"
                        onClick={handleRemove}
                    >
                        <img src={deleteIcon} alt="Delete" />
                    </button>
                </div>
            );
        } else if (previewImage && !isUploadingImage) {
            return (
                <div className="relative bg-[#F3F0FF] p-2 rounded-xl">
                    <img
                        onError={(e: any) => (e.target.src = imageError)}
                        src={previewImage}
                        className="w-[200px] h-[150px] rounded-xl object-cover"
                        alt="Uploaded"
                    />
                    <button
                        type="button"
                        className="absolute top-3 right-3 bg-white p-1 w-7 h-7 rounded-full"
                        onClick={handleRemove}
                    >
                        <img src={deleteIcon} alt="Delete" />
                    </button>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="upload__file-wrapper !flex !flex-col gap-4">
            {!previewImage && (
                <>
                    <div className="flex items-center justify-center border rounded-xl border-dashed border-[#5945aa50] p-5">
                        <input
                            type="file"
                            accept={acceptFiles}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            id={`file-input-${name}`}
                            onBlur={() => setFieldTouched(name, true)}
                        />

                        <label htmlFor={`file-input-${name}`} style={{ cursor: 'pointer' }}>
                            {isUploadingImage ? (
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
                                <img
                                    src="/assets/images/add_photo_alternate_rounded.svg"
                                    className="w-[200px] h-[150px]"
                                    alt="Upload"
                                />
                            )}
                        </label>
                    </div>

                    {touched[name] && errors[name] && typeof errors[name] === 'string' && (
                        <div className="text-red-500 text-center text-sm">
                            {errors[name] as string}
                        </div>
                    )}
                </>
            )}

            {isUploadingImage && (
                <div className="flex items-center justify-center border rounded-xl border-dashed border-[#5945aa50] p-5">
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
                    </div>{' '}
                </div>
            )}
            {previewImage && (
                <div className="file-item w-full flex flex-col items-center gap-2 p-1 rounded-xl">
                    {renderFilePreview()}
                </div>
            )}
            <ModalCustom opened={modalOpen} setOpen={setModalOpen} title="View PDF">
                <iframe
                    src={previewImage || ''}
                    width="100%"
                    height="500px"
                    style={{ border: 'none' }}
                    title="PDF Viewer"
                />
            </ModalCustom>
        </div>
    );
};

export default NewUploadImgRepeaterAttachment;
