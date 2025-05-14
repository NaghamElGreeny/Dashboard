import { FieldArray, useFormikContext } from 'formik';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { IoAddCircleOutline } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';
import { BaseInputField } from '../../atoms/BaseInputField';
import MultipleAttachmentsUpload from '../../atoms/MultipleAttachmentsUpload';
import showAlert from '../../atoms/ShowAlert';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import GeneralCustomSelect from '../../molecules/selects/Products/GeneralCustomSelect';

interface ProductDetailsProps {
    refetch?: () => void;
}

const baseUrl = import.meta.env.VITE_BASE_URL;
const user_token = Cookies.get('token');
const token = user_token;
const authorizationHeader = `Bearer ${token}`;

const ProductDetails: React.FC<ProductDetailsProps> = ({ refetch }) => {
    const { t } = useTranslation();
    const { setFieldValue, values } = useFormikContext<{ product_details: any[]; products: any }>();

    const isDefaultList = [
        {
            id: 0,
            value: 0,
            status: false,
            label: t('no'),
        },
        {
            id: 1,
            value: 1,
            status: true,
            label: t('yes'),
        },
    ];

    const handleDeleteProductDetail = async (
        id: number,
        remove: (index: number) => void,
        index: number
    ) => {
        if (id) {
            showAlert(t('delete_confirmation'), '', false, t('ok'), true, 'warning', async () => {
                try {
                    const response = await fetch(`${baseUrl}/delete_product_detail/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: authorizationHeader,
                        },
                    });

                    const responseData = await response.json(); // Extract JSON data

                    if (!response.ok) {
                        throw new Error(responseData?.message || t('errorOccurred'));
                    }

                    setFieldValue(
                        'product_details',
                        values?.product_details?.filter((detail) => detail.product_detail_id !== id)
                    );

                    refetch && refetch();

                    ShowAlertMixin({
                        type: 15,
                        icon: 'success',
                        title: t('isDeletedSuccessfully', { name: t('labels.product_details') }),
                    });
                } catch (err: any) {
                    ShowAlertMixin({
                        type: 15,
                        icon: 'error',
                        title: err?.message,
                    });
                }
            });
        } else {
            remove(index);
        }
    };

    return (
        <FieldArray name="product_details">
            {({ push, remove }) => (
                <div className="product_details grid grid-cols-12 gap-2">
                    {values?.product_details?.map((productDetail, index) => (
                        <div
                            key={productDetail.id || index}
                            className="col-span-12 grid grid-cols-12 gap-2"
                        >
                            <div className="flex items-center xl:gap-8 my-4 mt-10 col-span-12">
                                <div className="border border-border-primary flex-grow"></div>
                                <p className="text-center text-secondary text-xl mx-2">
                                    {t('labels.product_details')}
                                    {values?.products?.length > 1 ? index + 1 : ''}
                                </p>
                                <div className="border border-border-primary flex-grow"></div>
                            </div>

                            <div className="px-6 py-3 rounded-2xl bg-white grid grid-cols-12 gap-2 col-span-12">
                                <div className="col-span-12 md:col-span-6">
                                    <MultipleAttachmentsUpload
                                        name={`product_details[${index}].images`}
                                        label={t('labels.images')}
                                        model="products"
                                        refetch={refetch}
                                        initialValues={
                                            productDetail?.images
                                                ?.filter(Boolean)
                                                ?.map((img: any) => {
                                                    if (!img?.id || !img?.image) {
                                                        return null;
                                                    }
                                                    return {
                                                        id: img.id,
                                                        url: img.image,
                                                    };
                                                })
                                                .filter(Boolean) || []
                                        }
                                        onChange={(imageIds) => {
                                            setFieldValue(
                                                `product_details[${index}].images`,
                                                imageIds
                                            );
                                        }}
                                    />
                                </div>

                                <div className="col-span-12 md:col-span-6">
                                    <MultipleAttachmentsUpload
                                        name={`product_details[${index}].videos`}
                                        label={t('labels.videos')}
                                        model="products"
                                        type="video"
                                        acceptFiles="video/mp4,video/mkv"
                                        refetch={refetch}
                                        initialValues={
                                            productDetail?.videos
                                                ?.filter(Boolean)
                                                ?.map((video: any) => {
                                                    if (!video?.id || !video?.media) {
                                                        return null;
                                                    }
                                                    return {
                                                        id: video.id,
                                                        url: video.media,
                                                    };
                                                })
                                                .filter(Boolean) || []
                                        }
                                        onChange={(videoIds) => {
                                            setFieldValue(
                                                `product_details[${index}].videos`,
                                                videoIds
                                            );
                                        }}
                                    />
                                </div>

                                <div className="col-span-6">
                                    <GeneralCustomSelect
                                        name={`product_details[${index}].size_id`}
                                        api="size_without_pagination"
                                        label={t('labels.size')}
                                        placeholder={t('select') + ' ' + t('labels.size')}
                                        onChange={(option: any) =>
                                            setFieldValue(
                                                `product_details[${index}].size_id`,
                                                option.value
                                            )
                                        }
                                        // value={values?.product_details[index]?.size_id || ''}
                                        value={productDetail?.size_id || ''}
                                    />
                                </div>

                                <div className="col-span-6">
                                    <GeneralCustomSelect
                                        name={`product_details[${index}].color_id`}
                                        api="color_without_pagination"
                                        label={t('labels.color')}
                                        placeholder={t('select') + ' ' + t('labels.color')}
                                        onChange={(option: any) =>
                                            setFieldValue(
                                                `product_details[${index}].color_id`,
                                                option.value
                                            )
                                        }
                                        value={productDetail?.color_id || ''}
                                        // value={values?.product_details[index]?.color_id || ''}
                                    />
                                </div>

                                <div className="col-span-6">
                                    <BaseInputField
                                        id={`product_details[${index}].price`}
                                        placeholder={t('enter') + ' ' + t('labels.price')}
                                        type="number"
                                        label={t('labels.price')}
                                        name={`product_details[${index}].price`}
                                        defaultValue={productDetail.price}
                                    />
                                </div>

                                <div className="col-span-6">
                                    <BaseInputField
                                        id={`product_details[${index}].quantity`}
                                        placeholder={t('enter') + ' ' + t('labels.quantity')}
                                        type="number"
                                        label={t('labels.quantity')}
                                        name={`product_details[${index}].quantity`}
                                        defaultValue={productDetail.quantity}
                                    />
                                </div>

                                <div className="col-span-6">
                                    <BaseInputField
                                        id={`product_details[${index}].sku`}
                                        placeholder={t('enter') + ' ' + t('labels.sku')}
                                        type="text"
                                        label={t('labels.sku')}
                                        name={`product_details[${index}].sku`}
                                        defaultValue={productDetail.sku}
                                    />
                                </div>

                                <div className="col-span-6">
                                    <GeneralCustomSelect
                                        name={`product_details[${index}].is_default`}
                                        label={t('labels.is_default')}
                                        placeholder={t('select')}
                                        onChange={(option: any) =>
                                            setFieldValue(
                                                `product_details[${index}].is_default`,
                                                option?.value
                                            )
                                        }
                                        optionsList={isDefaultList}
                                        value={
                                            productDetail?.is_default !== undefined
                                                ? productDetail.is_default
                                                : 0
                                        }
                                    />
                                </div>

                                {values?.product_details?.length > 1 && (
                                    <div className="col-span-12 flex items-center justify-center pt-4">
                                        <button
                                            type="button"
                                            className="text-red-500 font-bold px-2"
                                            onClick={() =>
                                                handleDeleteProductDetail(
                                                    productDetail.product_detail_id,
                                                    remove,
                                                    index
                                                )
                                            }
                                        >
                                            <span className="flex flex-wrap gap-1">
                                                <MdDelete className="cursor-pointer text-[19px] text-red-500 me-2" />
                                                {t('buttons.delete')}
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    <div
                        className="col-span-12 flex items-center justify-center hover:cursor-pointer pt-4"
                        onClick={() =>
                            push({
                                id: crypto.randomUUID(),
                                images: [],
                                videos: [],
                                size_id: '',
                                color_id: '',
                                price: '',
                                quantity: '',
                                sku: '',
                                is_default: '',
                            })
                        }
                    >
                        <IoAddCircleOutline className="cursor-pointer text-[19px] text-[#50cd89]" />
                        <p className="text-[18px] font-bold px-2 text-[#50cd89]">
                            {t('labels.add_other_details')}
                        </p>
                    </div>

                    {/* <div
                        className="col-span-12 flex items-center justify-center hover:cursor-pointer pt-4"
                        onClick={() => {
                            push({
                                id: crypto.randomUUID(), // Unique ID
                                images: [], // Ensure images array is empty for new product
                                videos: [],
                                size_id: '',
                                color_id: '',
                                price: '',
                                quantity: '',
                                sku: '',
                                is_default: '',
                            });

                            // Ensure Formik state updates immediately
                            setFieldValue('product_details', [
                                ...values.product_details,
                                { images: [], videos: [] },
                            ]);
                        }}
                    >
                        <IoAddCircleOutline className="cursor-pointer text-[19px] text-[#50cd89]" />
                        <p className="text-[18px] font-bold px-2 text-[#50cd89]">
                            {t('labels.add_other_details')}
                        </p>
                    </div> */}
                </div>
            )}
        </FieldArray>
    );
};

export default ProductDetails;
