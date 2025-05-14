import { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import 'react-modal-video/css/modal-video.css';
import videoThumbnail from '/assets/images/thumbnail.png';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../store';

type VideoLightBoxProps = {
    videos?: { id: string; media: string; title: string }[];
    startIndex?: number;
    showFirstOnly?: boolean; // New prop to control display of only the first video
};

const VideoLightBox = ({ videos, startIndex = 0, showFirstOnly = false }: VideoLightBoxProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [videoIndex, setVideoIndex] = useState<number>(startIndex);

    const isRtl =
        useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    useEffect(() => {
        window['global'] = window as never;
    }, []);

    useEffect(() => {
        if (isOpen) {
            setVideoIndex(startIndex); // Reset to startIndex when opened
        }
    }, [isOpen, startIndex]);

    if (!videos || videos.length === 0) return null; // Return null if no videos

    const handleNext = () => {
        setVideoIndex((prev) => (prev + 1) % videos.length);
    };

    const handlePrev = () => {
        setVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
    };

    const swipeHandlers = useSwipeable({
        onSwipedLeft: handleNext,
        onSwipedRight: handlePrev,
        trackMouse: true,
    });

    return (
        <div>
            {/* Show only the first video if showFirstOnly is true */}
            {showFirstOnly ? (
                <button type="button" onClick={() => setIsOpen(true)} className="relative">
                    <img
                        src={videoThumbnail}
                        alt={videos[0]?.title || 'video'}
                        className="w-20 h-20 my-4"
                    />
                    <div className="absolute inset-0 w-20 h-20 my-4 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-10 h-10 text-white"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </button>
            ) : (
                // Display all thumbnails (if showFirstOnly is false)
                <div>
                    {videos.map((video: any, index: number) => (
                        <button
                            key={video.id}
                            type="button"
                            onClick={() => {
                                setIsOpen(true);
                                setVideoIndex(index);
                            }}
                            className="relative"
                        >
                            <img
                                src={videoThumbnail}
                                alt={video.title || 'video'}
                                className="w-20 h-20 my-4"
                            />
                            <div className="absolute inset-0 w-20 h-20 my-4 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-10 h-10 text-white"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Video Lightbox */}
            {isOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
                    {...swipeHandlers}
                >
                    <button
                        className="absolute top-4 right-4 text-white text-3xl"
                        onClick={() => setIsOpen(false)}
                    >
                        ✕
                    </button>
                    <div className="relative flex items-center justify-center">
                        <video
                            src={videos[videoIndex]?.media}
                            controls
                            autoPlay
                            className="w-full max-h-[70vh] rounded-md"
                        />
                    </div>
                    {videos?.length > 1 && (
                        <>
                            <button
                                className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-5xl"
                                onClick={handlePrev}
                            >
                                {isRtl ? '›' : '‹'}
                            </button>
                            <button
                                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-5xl"
                                onClick={handleNext}
                            >
                                {isRtl ? '‹' : '›'}
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default VideoLightBox;
