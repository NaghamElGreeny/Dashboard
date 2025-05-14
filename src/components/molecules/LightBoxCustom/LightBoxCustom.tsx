import { useEffect, useState } from 'react';
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';

import imageError from '/assets/404.webp';

// const getItems = [
//     {
//         id: '1',
//         src: '/assets/images/lightbox1.jpg',
//         title: 'This is dummy caption. It has been placed here solely to demonstrate the look and feel of finished, typeset text.',
//         description: 'Photo: Samuel Rohl',
//     },
// ];

type LightBoxCustom_TP = {
    getItems?: any;
    isShow?: boolean;
    isProduct?: boolean;
    isRateUser?: boolean;
    openLightBox?: boolean;
    closeLightBox?: any;
    index: number;
};

const LightBoxCustom = ({
    getItems,
    isShow,
    isProduct,
    isRateUser,
    openLightBox,
    closeLightBox,
    index,
}: LightBoxCustom_TP) => {
    // console.log('🚀 ~ index:', index);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [photoIndex, setPhotoIndex] = useState<number>(0);

    useEffect(() => {
        window['global'] = window as never;
    }, []);

    useEffect(() => {
        if (openLightBox) {
            setIsOpen(true);
        }
    }, [openLightBox]);

    if (!getItems || getItems.length === 0) return null; // Return null if no items
    return (
        <div>
            {isOpen && (
                <Lightbox
                    mainSrc={`${getItems[photoIndex]?.src}`}
                    nextSrc={`${getItems[photoIndex + (1 % getItems.length)]?.src}`}
                    prevSrc={`${setTimeout(() => {
                        return getItems[(photoIndex + getItems.length - 1) % getItems.length]?.src;
                    })}`}
                    onCloseRequest={() => {
                        setIsOpen(false);
                        closeLightBox && closeLightBox();
                    }}
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
    );
};
export default LightBoxCustom;
