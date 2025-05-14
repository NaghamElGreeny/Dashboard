import { MRT_ColumnDef } from 'mantine-react-table';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../components/molecules/BreadCrumbs';
import useFetch from '../../../hooks/UseFetch';
import Loading from '../../atoms/loading';
import LightBox from '../../molecules/LightBox/LightBox';
import Rating from '../../molecules/Rating/Rating';
import VideoLightBox from '../../molecules/VideoLightBox/VideoLightBox';
import TableCompCustom from '../tantable/TableCutsom';
import imageError from '/assets/images/logo.png';

export default function ShowProduct() {
    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const locale = i18n.language;

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.products.title'), to: '/products/index' },
        { label: t('breadcrumb.products.show') },
    ];

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `products/${id}`,
        queryKey: [`products/${id}`],
    });

    const columns: MRT_ColumnDef[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.images'),
            Cell: ({ row }: any) => (
                <div className="flex gap-5">
                    {row.original?.images && row.original?.images.length > 0 ? (
                        //@ts-ignore
                        <LightBox
                            // isProduct
                            getItems={row.original?.images?.map((image: any) => ({
                                src: image.media || imageError,
                            }))}
                        >
                            <img
                                src={row.original?.images[0].media || imageError}
                                alt={'Image'}
                                className="rounded-full w-20 h-20 object-cover cursor-pointer"
                            />
                        </LightBox>
                    ) : (
                        <span>{t('not_found')}</span>
                    )}
                </div>
            ),
            accessorKey: 'images',
        },

        {
            header: t('labels.videos'),
            Cell: ({ row }: any) => (
                <div className="flex gap-5">
                    {row.original?.videos && row.original?.videos.length > 0 ? (
                        <VideoLightBox
                            videos={row.original?.videos} // Pass all videos to the lightbox
                            startIndex={0} // Ensure it starts with the first video
                            showFirstOnly={true} // prop to display only the first video in the table
                        />
                    ) : (
                        <span>{t('not_found')}</span>
                    )}
                </div>
            ),
            accessorKey: 'videos',
        },
        {
            header: t('labels.quantity'),
            accessorKey: 'quantity',
            Cell: ({ row }: any) => {
                const quantity = row.original?.quantity || '---';
                return <span>{quantity}</span>;
            },
        },

        {
            header: t('labels.price'),
            accessorKey: 'price',
            Cell: ({ row }: any) => {
                const price = row.original?.price || '---';
                return <span>{price}</span>;
            },
        },

        {
            header: t('labels.sku'),
            accessorKey: 'sku',
            Cell: ({ row }: any) => {
                const sku = row.original?.sku || '---';
                return <span>{sku}</span>;
            },
        },

        {
            header: t('labels.size'),
            accessorKey: 'size',
            Cell: ({ row }: any) => {
                const size = row.original?.size?.title || '---';
                return <span>{size}</span>;
            },
        },

        {
            header: t('labels.color'),
            Cell: ({ row }: any) => {
                const hexColor = row.original?.color?.hex;
                const isWhite = hexColor.toLowerCase() === '#fff'; // Check if the color is white

                return (
                    <div
                        style={{
                            backgroundColor: hexColor,
                            padding: '4px 8px',
                            borderRadius: '16px',
                            display: 'inline-block',
                            color: isWhite ? '#000' : '#fff',
                            border: isWhite ? '1px solid #000' : 'none',
                        }}
                    >
                        {hexColor}
                    </div>
                );
            },
            accessorKey: 'color',
        },

        {
            accessorKey: 'is_default',
            header: t('labels.is_default'),
            Cell: ({ row }: any) => {
                const is_default = row.original.is_active ? t('yes') : t('no');
                return (
                    <span className={`${row.original.is_active ? 'active' : 'inactive'} statuses`}>
                        {is_default}
                    </span>
                );
            },
        },

        {
            header: t('labels.product_buyers_count'),
            accessorKey: 'sold',
            Cell: ({ row }: any) => {
                const sold = row.original?.sold;
                return <span>{sold}</span>;
            },
        },

        {
            header: t('labels.rate'),
            Cell: ({ row }: any) => (
                <Rating value={row.original?.rate_avg} onChange={row.original?.rate_avg} />
            ),
            accessorKey: 'rate',
        },

        {
            header: t('labels.created_at'),
            accessorKey: 'created_at',
            Cell: ({ row }: any) => {
                const created_at = row.original?.created_at || '---';
                return <span>{created_at}</span>;
            },
        },
    ];

    return (
        <>
            {(showDataLoading && <Loading />) || (
                <>
                    <Breadcrumb items={breadcrumbItems} />
                    {showDataSuccess && (
                        <>
                            <div className="details-section w-full bg-white shadow rounded-lg p-5">
                                <div className="grid grid-cols-12 gap-2 mb-5">
                                    {/* Centering the LightBox */}
                                    <div className="col-span-12 flex justify-center items-center">
                                        <LightBox
                                            isShow
                                            getItems={[
                                                {
                                                    src:
                                                        showData?.data?.main_image?.media ||
                                                        imageError,
                                                    title: showData?.data?.title,
                                                },
                                            ]}
                                        />
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                        <p className="font-bold text-black mb-4">
                                            {t('labels.product_name')}
                                        </p>
                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.title || t('not_found')}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                        <p className="font-bold text-black mb-4">
                                            {t('labels.brands')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.brand?.title || t('not_found')}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                        <p className="font-bold text-black mb-4">
                                            {t('labels.main_category')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.main_category?.title || t('not_found')}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                        <p className="font-bold text-black mb-4">
                                            {t('labels.sub_category')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.sub_category?.title || t('not_found')}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                        <p className="font-bold text-black mb-4">
                                            {t('labels.sub_subCategories')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.sub_sub_category?.title ||
                                                t('not_found')}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                        <p className="font-bold text-black mb-4">
                                            {t('labels.created_at')}
                                        </p>

                                        <p className="font-semibold text-gray-500">
                                            {showData?.data?.created_at || t('not_found')}
                                        </p>
                                    </div>

                                    <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                        <p className="font-bold text-black mb-4">
                                            {t('labels.is_trendy')}
                                        </p>

                                        <span
                                            className={`${
                                                showData?.data?.is_trendy ? 'active' : 'inactive'
                                            } statuses`}
                                        >
                                            {showData?.data?.is_trendy ? t('yes') : t('no')}
                                        </span>
                                    </div>
                                </div>

                                <hr />
                                <div className="product_info mb-5 mt-3">
                                    <p className="font-bold text-black mb-4">
                                        {t('labels.complete_outfits')}
                                    </p>

                                    <ul>
                                        {showData?.data?.complete_outfits &&
                                        showData?.data?.complete_outfits.length > 0 ? (
                                            showData?.data?.complete_outfits?.map(
                                                (service: any, index: number) => (
                                                    <li key={index}>{service.title}</li>
                                                )
                                            )
                                        ) : (
                                            <p className="font-semibold text-gray-500">
                                                {t('no_data')}
                                            </p>
                                        )}
                                    </ul>
                                </div>
                                <hr />

                                <hr />
                                <div className="product_info mb-5 mt-3">
                                    <p className="font-bold text-black mb-4">
                                        {t('labels.short_desc')}
                                    </p>

                                    <div
                                        className="font-semibold text-gray-500"
                                        dangerouslySetInnerHTML={{
                                            __html: showData?.data?.short_desc || t('not_found'),
                                        }}
                                    ></div>
                                </div>
                                <hr />
                                <hr />
                                <div className="product_info mb-5 mt-3">
                                    <p className="font-bold text-black mb-4">
                                        {t('labels.long_desc')}
                                    </p>

                                    <div
                                        className="font-semibold text-gray-500"
                                        dangerouslySetInnerHTML={{
                                            __html: showData?.data?.long_desc || t('not_found'),
                                        }}
                                    ></div>
                                </div>
                                <hr />
                            </div>

                            <div className="grid items-center w-full mt-5  bg-transparent rounded-lg">
                                <h5 className="text-xl font-bold text-primary mb-3">
                                    {t('labels.product_details')}
                                </h5>

                                <TableCompCustom
                                    showOnly={true}
                                    columns={columns}
                                    data={showData?.data?.details || []}
                                    title={t('buttons.add')}
                                    isLoading={showDataLoading}
                                />
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    );
}
