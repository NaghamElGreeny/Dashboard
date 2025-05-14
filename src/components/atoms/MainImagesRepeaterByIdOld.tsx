import React, { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import showAlert from './ShowAlert';
import UploadImageProductRepeater from './UploadImageProductRepeater';
import { useMutate } from '../../hooks/UseMutate';
import { useParams } from 'react-router-dom';
import ShowAlertMixin from './ShowAlertMixin';

const MainImagesRepeaterById = ({
    disabled,
    required,
    idProduct,
    refetch,
    model,
    name,
}: {
    disabled: any;
    required: any;
    idProduct?: any;
    refetch?: any;
    model?: any;
    name?: string;
}) => {
    const { values, setFieldValue } = useFormikContext<any>();
    // console.log('🚀 ~ values:', values);

    const [selectedImageId, setSelectedImageId] = useState('');
    const [selectIdImageRemove, setSelectIdImageRemove] = useState('');
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const { t } = useTranslation();
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

    useEffect(() => {
        if (images.length <= 0) {
            addInput();
        }
    }, [values.images]);

    const handleUploadSuccess = (uploadedImage: any, index: any) => {
        const updatedImages = [...images];
        updatedImages[index] = {
            ...updatedImages[index],
            image: uploadedImage,
            isNew: true,
        };
        setFieldValue('images', updatedImages);
    };

    const { mutate: DeleteImageMutate, isLoading: isLoadingImageDelete } = useMutate({
        general: true,
        mutationKey: [`attachments/${selectIdImageRemove}`],
        endpoint: `attachments/${selectIdImageRemove}`,
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message || t('isDeletedSuccessfully', { name: t('labels.image') }),
            });

            const updatedImages = values.images.filter(
                (_: any, i: any) => i !== selectedImageIndex
            );
            if (updatedImages.length <= 0) {
                addInput();
            }
            setFieldValue('images', updatedImages);
            refetch();
        },
        onError: (err: any) => {
            showAlert(err?.response?.data?.message, '', false, t('ok'), true, 'error');
        },
        formData: true,
        method: 'delete',
    });

    const handleRemove = (index: any) => {
        const images = values.images;

        if (images.length > 0) {
            const selectedImage = images[index];

            if (selectedImage?.isNew) {
                const updatedImages = images.filter((_: any, i: any) => i !== index);
                setFieldValue('images', updatedImages);

                if (updatedImages.length <= 0) {
                    addInput();
                }
            } else {
                setSelectIdImageRemove(selectedImage?.id);
                setSelectedImageIndex(index);
                deleteItem();
            }
        } else {
            showAlert(t('You must have at least one image.'), '', false, t('ok'), true, 'error');
        }
    };

    const deleteItem = () => {
        showAlert(t('delete_confirmation'), '', false, t('ok'), true, 'warning', () =>
            DeleteImageMutate({})
        );
    };

    const removeInput = (id: any) => {
        setSelectedImageId(id);
    };

    return (
        <>
            {images.map((input: any, index: any) => (
                <React.Fragment key={input?.id}>
                    <div
                        className={`col-span-12   ${
                            index === 0 ? 'col-span-12' : 'md:col-span-6 lg:col-span-3'
                        }`}
                    >
                        <div className={`grid grid-cols-12 `}>
                            <div className="flex justify-center w-full my-4 col-span-12">
                                <UploadImageProductRepeater
                                    showOnly={disabled}
                                    deleteImageById={true}
                                    name={`images[${index}]`}
                                    oldValues={values}
                                    imagePath={input?.image}
                                    showpropertie={false}
                                    className="!flex !flex-col gap-4"
                                    onUploadSuccess={(uploadedImage: any) =>
                                        handleUploadSuccess(uploadedImage, index)
                                    }
                                    onRemove={() => handleRemove(index)}
                                    index={index}
                                    showAddImage={index + 1}
                                    isNew={input.isNew}
                                    acceptFiles="image/*,.pdf"
                                    model={model}
                                />
                            </div>
                        </div>
                    </div>
                    {index + 1 && images[0]?.image != 0 && index === images.length - 1 && (
                        <div className="col-span-12 flex justify-center">
                            <button
                                type="button"
                                onClick={addInput}
                                disabled={images[images.length - 1]?.image === ''}
                                className={`mt-4 px-4 py-2 ${
                                    images[images.length - 1]?.image === '' &&
                                    'bg-red-500 hover:cursor-not-allowed'
                                } bg-blue-500 text-white rounded `}
                            >
                                {t('buttons.add_image')}
                            </button>
                        </div>
                    )}
                </React.Fragment>
            ))}
        </>
    );
};

export default MainImagesRepeaterById;
