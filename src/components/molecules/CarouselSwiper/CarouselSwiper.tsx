import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

// Import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import imageError from '/assets/404.webp';
import LightBoxCustom from '../LightBoxCustom/LightBoxCustom';

interface Image {
    id: string;
    url: string;
    media: string;
}

interface CarouselSwiperProps {
    productImages: Image[];
    mainImage: Image[];
    selectColor: any;
}

const CarouselSwiper = ({ productImages, mainImage, selectColor }: CarouselSwiperProps) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const [swiperInstance, setSwiperInstance] = useState<any>(null);
    const [isOpen, setIsOpen] = useState<number | null>(null);

    const totalImages = productImages?.length;
    const displayedImages = productImages.slice(0, 2); // First two images displayed prominently
    const hiddenImages = productImages.slice(2); // Remaining images hidden behind the "+count" overlay
    const remainingCount = hiddenImages.length;

    return (
        <div>
            {/* LightBox */}
            {isOpen !== null && (
                <LightBoxCustom
                    getItems={productImages.map((img) => ({
                        src: img.media,
                        title: `Image ${img.id}`,
                        description: `Description of Image ${img.id}`,
                    }))}
                    openLightBox={isOpen !== null}
                    closeLightBox={() => setIsOpen(null)}
                    index={isOpen}
                />
            )}

            {/* Swiper */}
            <Swiper
                style={{
                    // @ts-ignore
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': '#fff',
                }}
                spaceBetween={10}
                navigation={true}
                onSwiper={setSwiperInstance}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mainSwiper"
            >
                {productImages.map((image, index) => (
                    <SwiperSlide key={index}>
                        <img
                            onClick={() => setIsOpen(index)} // Open LightBox with the selected image
                            onError={(e: any) => (e.target.src = imageError)}
                            className="cursor-pointer w-full h-[300px] md:!h-[500px] md:!w-full max-h-[500px] object-contain"
                            loading="eager"
                            src={image.media}
                            alt={`image-${index}`}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Thumbnail Section */}
            {/* <div className="mt-6 grid grid-cols-3 gap-2 md:gap-4 w-full">
                {displayedImages.map((image, index) => (
                    <div
                        key={index}
                        className="relative w-full h-24 sm:h-36 md:h-44 cursor-pointer"
                        onClick={() => setIsOpen(index)} // Open LightBox with the clicked displayed image
                    >
                        <img
                            onError={(e: any) => (e.target.src = imageError)}
                            alt={`thumbnail-image-${index}`}
                            className="w-full h-full object-contain"
                            src={image.media}
                        />
                    </div>
                ))}

                {hiddenImages.length > 0 && (
                    <div
                        className="relative w-full h-24 sm:h-36 md:h-44 cursor-pointer"
                        onClick={() => setIsOpen(2)} // Open LightBox with the first hidden image
                    >
                        <img
                            onError={(e: any) => (e.target.src = imageError)}
                            alt="background-image"
                            className="w-full h-full object-contain"
                            src={hiddenImages[0]?.media} // Use the first hidden image as the background
                        />
                        <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(11, 18, 30, 0.57)' }}
                        >
                            <p className="text-white font-bold text-xl">+{remainingCount}</p>
                        </div>
                    </div>
                )}
            </div> */}
        </div>
    );
};

export default CarouselSwiper;
