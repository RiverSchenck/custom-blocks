import React from 'react';
import { ImageInputItem, InputItem } from '../types';
import styles from '../styles';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { handleUserSelectImage } from './Inputs/HandleUserInputs';
import { IconCaretLeft20, IconCaretRight20, IconTrashBin20 } from '@frontify/fondue';
import { handleDeleteImage, handleImageWidthChange, handleSelectImage } from './Inputs/ImageInput';

type ImageCarouselProps = {
    specificInput: ImageInputItem;
    inputs: InputItem[];
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>;
    isFrontend: boolean;
};

interface ArrowProps {
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

function CustomNextArrow(props: ArrowProps) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{
                ...style,
                color: 'black', // Ensures the arrow symbol color is black
                fontSize: '30px', // Adjust size as needed
                zIndex: 20, // Ensure it's above all other content
            }}
            onClick={onClick}
        >
            <IconCaretRight20 />
        </div>
    );
}

function CustomPrevArrow(props: ArrowProps) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{
                ...style,
                display: 'block',
                color: 'black', // Ensures the arrow symbol color is black
                fontSize: '30px', // Adjust size as needed
                zIndex: 20, // Ensure it's above all other content
            }}
            onClick={onClick}
        >
            <IconCaretLeft20 />
        </div>
    );
}

const ImageCarousel = ({ specificInput, inputs, setInputs, isFrontend = true }: ImageCarouselProps) => {
    const imageCount = specificInput.images.length;
    const settings = {
        customPaging: (index: number) => (
            <button>
                {specificInput.images[index] && (
                    <img
                        src={specificInput.images[index].url}
                        alt={`Thumb ${index}`}
                        style={{
                            height: '40px', // Fixed height
                            width: 'auto', // Auto width to maintain aspect ratio
                            objectFit: 'contain', // Cover to ensure the image fills the area nicely, might not be needed here
                        }}
                    />
                )}
            </button>
        ),
        dots: imageCount > 1,
        dotsClass: 'slick-dots slick-thumb',
        infinite: imageCount > 1,
        speed: 500,
        slidesToShow: Math.min(imageCount, 1),
        slidesToScroll: 1,
        nextArrow: imageCount > 1 ? <CustomNextArrow /> : undefined,
        prevArrow: imageCount > 1 ? <CustomPrevArrow /> : undefined,
        arrows: imageCount > 1,
    };

    return (
        <div className="slider-container" style={{ margin: '0 auto', maxWidth: '70%', padding: '20px' }}>
            <Slider {...settings}>
                {specificInput.images.map((imgData, idx) => (
                    <div key={imgData.id || idx}>
                        <div style={{ marginBottom: '15px' }}>
                            <img
                                src={imgData.url}
                                alt={`Image ${idx + 1}`}
                                style={{
                                    width: '100%',
                                    height: '125px', // Fixed height for all images
                                    objectFit: 'contain', // Ensures images cover the area without distorting aspect ratio
                                }}
                                onClick={() => {
                                    if (isFrontend) {
                                        handleUserSelectImage(specificInput.id, imgData.id, inputs, setInputs);
                                    } else {
                                        handleSelectImage(specificInput.id, imgData.id, inputs, setInputs); // Assuming you have this function defined
                                    }
                                }}
                            />
                            {!isFrontend && (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="number"
                                        value={imgData.width || ''}
                                        onChange={(e) => {
                                            if (Number(e.target.value) >= 0) {
                                                handleImageWidthChange(
                                                    specificInput.id,
                                                    imgData.id,
                                                    Number(e.target.value),
                                                    inputs,
                                                    setInputs
                                                );
                                            }
                                        }}
                                        placeholder="Image width"
                                        style={styles.imageWidthInput}
                                    />
                                    <button
                                        onClick={() => {
                                            handleDeleteImage(specificInput.id, imgData.id, inputs, setInputs);
                                        }}
                                        style={styles.deleteButton}
                                    >
                                        <IconTrashBin20 />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ImageCarousel;
