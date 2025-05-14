import { useState, useEffect } from 'react';
// @ts-ignore
import ModalVideo from 'react-modal-video';
import 'react-modal-video/css/modal-video.css';
import videoThumbnail from '/assets/images/thumbnail.png';

type VideoLightBoxProps = {
    videos?: { id: string; media: string; title: string }[];
};

const VideoLightBox = ({ videos }: VideoLightBoxProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [videoIndex, setVideoIndex] = useState<number>(0);

    useEffect(() => {
        window['global'] = window as never;
    }, []);

    if (!videos || videos.length === 0) return null; // Return null if no videos

    return (
        <div>
            {/* Video Thumbnails Grid */}
            <div>
                {videos.map((video, index) => (
                    <button
                        key={video.id}
                        type="button"
                        onClick={() => {
                            setIsOpen(true);
                            setVideoIndex(index);
                        }}
                        className="relative"
                    >
                        {/* Video Thumbnail */}
                        <img
                            src={videoThumbnail}
                            alt={video.title || 'video'}
                            className={'w-20 h-20 my-4'}
                        />
                        {/* Play Icon Overlay */}
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

            {/* Video Lightbox */}
            <ModalVideo
                channel="custom"
                isOpen={isOpen}
                url={videos[videoIndex]?.media}
                onClose={() => setIsOpen(false)}
            />
        </div>
    );
};

export default VideoLightBox;
