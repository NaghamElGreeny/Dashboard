import { useEffect, useState } from 'react';
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';
import imageError from '/assets/images/logo.png';

// const getItems = [
//     {
//         id: '1',
//         src: '/assets/images/lightbox1.jpg',
//         title: 'This is dummy caption. It has been placed here solely to demonstrate the look and feel of finished, typeset text.',
//         description: 'Photo: Samuel Rohl',
//     },
// ];

type LightBox_TP = {
    getItems?: any;
    isShow?: boolean;
    isProduct?: boolean;
    isRateUser?: boolean;
    isChat?: boolean;
};

const LightBox = ({ getItems, isShow, isProduct, isRateUser, isChat }: LightBox_TP) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [photoIndex, setPhotoIndex] = useState<number>(0);

    useEffect(() => {
        window['global'] = window as never;
    }, []);

    if (!getItems || getItems.length === 0) return null; // Return null if no items
    return (
        <div>
            <div className={isShow ? '' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'}>
                <>
                    {/* {getItems.map((item: any, index: number) => { */}
                    {/* return ( */}
                    <button
                        type="button"
                        // key={index}
                        // className={`${index === 3 ? 'md:row-span-2 md:col-span-2' : ''}`}
                        onClick={() => {
                            setIsOpen(true);
                            setPhotoIndex(0);
                        }}
                    >
                        <img
                            onError={(e: any) => (e.target.src = imageError)}
                            src={getItems[0].src}
                            alt="gallery"
                            data-fancybox="gallery"
                            className={
                                isShow
                                    ? 'w-36 h-36 rounded-full mb-4'
                                    : isProduct
                                    ? 'rounded-md w-24 h-18 object-cover my-4'
                                    : isRateUser
                                    ? 'w-10 h-10 rounded-full'
                                    : isChat
                                    ? 'w-[200px] h-[200px] object-cover rounded-lg'
                                    : 'rounded-full min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px] object-cover'
                            }
                            data-caption={getItems[0].title}
                        />
                    </button>
                    {/* ); */}
                    {/*  })} */}
                </>

                {isOpen && (
                    <Lightbox
                        mainSrc={`${getItems[photoIndex]?.src}`}
                        nextSrc={`${getItems[photoIndex + (1 % getItems.length)]?.src}`}
                        prevSrc={`${setTimeout(() => {
                            return getItems[(photoIndex + getItems.length - 1) % getItems.length]
                                ?.src;
                        })}`}
                        onCloseRequest={() => setIsOpen(false)}
                        onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % getItems.length)}
                        onMovePrevRequest={() =>
                            setPhotoIndex((photoIndex + getItems.length - 1) % getItems.length)
                        }
                        imageTitle={getItems[photoIndex]?.title}
                        imageCaption={getItems[photoIndex]?.description}
                        animationDuration={300}
                        keyRepeatLimit={180}
                    />
                )}
            </div>
        </div>
    );
};
export default LightBox;
