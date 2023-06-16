import React, { useState, useEffect, useRef } from 'react';

import { ReactComponent as Next } from './assets/images/next.svg';
import { ReactComponent as Prev } from './assets/images/prev.svg';
import { ReactComponent as Zoom } from './assets/images/zoom.svg';

import './assets/css/style.css';

const ZoomSlider = (props) => {

    const [slideIndex, setSlideIndex] = useState(1);
    const [zoom, setZoom] = useState(false);
    const [zoomReset, setZoomReset] = useState(false);
    const [startX, setStartX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const [swipeImage, setSwipeImage] = useState(null);
    const [transition, setTransition] = useState(false);
    const [prevTouchDistance, setPrevTouchDistance] = useState(null);
    const [auto, setAuto] = useState(false);
    const slidesRef = useRef(null);

    const nextSlide = () => {
        if (slideIndex === props.image.length) {
            return;
        }
        setSlideIndex(slideIndex + 1)
    };

    const previousSlide = () => {
        if (slideIndex === 1) {
            return;
        }
        setSlideIndex(slideIndex - 1);
    };

    // auto play slide 10s, no use setInterval, no setTimeout
    useEffect(() => {
        const timer = setTimeout(() => {
            setAuto(!auto);
            
            if (!zoom && zoomReset) {
                nextSlide();
            }

        }, 10000);

        return () => clearTimeout(timer);
    }, [auto, zoom, zoomReset]);   

    const showSlides = (n, slides) => {

        if (n > slides.length) {
            setSlideIndex(1);
        } 
        else if (n < 1) {
            setSlideIndex(slides.length);
        }

        var zoomLeft = false;
        var zoomRight = false;

        // remove class in item
        const allItem = document.querySelectorAll('.item');
        allItem.forEach((item) => {
            // check if item has class 'zoom-left' or 'zoom-right'
            if (item.classList.contains('zoom-left')) {
                zoomLeft = true;
            }
            else if (item.classList.contains('zoom-right')) {
                zoomRight = true;
            }

            item.classList.remove('active');
            item.classList.remove('prev');
            item.classList.remove('next');

            // remove class zoom-left and zoom-right
            if (zoomLeft) {
                item.classList.remove('zoom-left');
            }
            else if (zoomRight) {
                item.classList.remove('zoom-right');
            }
        });  

        // add class active to item
        if (props.image.length > 1) {
            slides[slideIndex - 1].classList.add('active');
        }
        else if (props.image.length === 1) {
            slides[0].classList.add('active');
        }

        // add class zoom-left and zoom-right to item active
        if (zoomLeft) {
            slides[slideIndex - 1].classList.add('zoom-left');
        }
        else if (zoomRight) {
            slides[slideIndex - 1].classList.add('zoom-right');
        }

        // add class prev and next to item
        if (slideIndex === 1) {
            if (props.image.length > 1) {
                slides[slideIndex].classList.add('next');
                slides[slides.length - 1].classList.add('prev');
            }
        }
        else if (slideIndex === slides.length) {
            if (props.image.length > 1) {
                slides[0].classList.add('next');
                slides[slideIndex - 2].classList.add('prev');
            }
        }
        else {
            if (props.image.length > 1) {
                slides[slideIndex].classList.add('next');
                slides[slideIndex - 2].classList.add('prev');
            }
        }

    };

    useEffect(() => {
        const slides = slidesRef.current.getElementsByClassName('item');
        showSlides(slideIndex, slides);

        // Add style overflow-x: hidden to element with ID "root"
        const rootElement = document.getElementById('root');

        if (rootElement) {
            rootElement.style.overflowX = 'hidden';
        }
    }, [slideIndex]);

    const handleZoom = () => {
        //remove class active in zoom button
        document.querySelector('.button-zoom-prev').classList.remove('active');
        document.querySelector('.button-zoom-next').classList.remove('active');

        if (!zoom) {
            setZoom(true);
            setZoomReset(false);
            setTransition(false); // Reset slide transition when zooming in

            // Apply zoom transform to the image
            const slides = slidesRef.current.getElementsByClassName('item');
            const currentSlide = slides[slideIndex - 1];

            if (currentSlide) {
                const img = currentSlide.querySelector('img');
                const imgWidth = img.offsetWidth;
                const translateX = imgWidth / 6;

                // all image scale
                const allImg = document.querySelectorAll('.item img');
                allImg.forEach((img) => {
                    img.style.transform = `scale(1) translateX(${translateX}px)`;
                });

                document.querySelector('.button-zoom-prev').classList.add('active');

                // add class zoom-left to item active
                document.querySelector('.item.active').classList.add('zoom-left');
            }
        } 
        else {
            setZoom(false);
            setZoomReset(true);
            setTransition(true); // Enable slide transition when zooming out

            // Reset image translation and zoom when zoom is toggled off
            const slides = slidesRef.current.getElementsByClassName('item');
            const currentSlide = slides[slideIndex - 1];

            if (currentSlide) {
                // all image scale
                const allImg = document.querySelectorAll('.item img');
                allImg.forEach((img) => {
                    img.style.transform = '';
                });
            }

            // remove class zoom-left and zoom-right in all item
            const allItem = document.querySelectorAll('.item');
            allItem.forEach((item) => {
                item.classList.remove('zoom-left');
                item.classList.remove('zoom-right');
            });
        }
    };

    const handleZoomButtonClick = (direction) => {
        // Apply zoom transform to the image
        const slides = slidesRef.current.getElementsByClassName('item');
        const currentSlide = slides[slideIndex - 1];

        //remove class active in zoom button
        document.querySelector('.button-zoom-prev').classList.remove('active');
        document.querySelector('.button-zoom-next').classList.remove('active');

        if (currentSlide) {
            const img = currentSlide.querySelector('img');
            const imgWidth = img.offsetWidth;
            const translateX = direction === 'left' ? imgWidth / 6 : -imgWidth / 6;
            
            // remove class zoom-left and zoom-right in all item
            const allItem = document.querySelectorAll('.item');
            allItem.forEach((item) => {
                item.classList.remove('zoom-left');
                item.classList.remove('zoom-right');
            });

            // check if direction == left then add class active in zoom button class .button-pre
            if (direction === 'left') {
                const buttonPrev = document.querySelector('.button-zoom-prev');
                buttonPrev.classList.add('active');

                // add class left to item active
                document.querySelector('.item.active').classList.add('zoom-left');
            }
            else {
                const buttonNext = document.querySelector('.button-zoom-next');
                buttonNext.classList.add('active');

                // add class left to item active
                document.querySelector('.item.active').classList.add('zoom-right');
            }

            // all image scale
            const allImg = document.querySelectorAll('.item img');
            allImg.forEach((img) => {
                img.style.transform = `translateX(${translateX}px)`;
            });

            setTransition(false); // Disable slide transition when zooming left or right
        }
    };

    const handleTouchStart = (event) => {
        if ((event.touches.length === 1 && zoom) || event.touches.length === 2) {
            setStartX(event.touches[0].clientX);
            setIsSwiping(true);
        } 
        else {
            setIsSwiping(false);
        }

        // set setSwipeImage when slide is not zoom
        if (event.touches.length === 1 && !zoom) {
            setStartX(event.touches[0].clientX);
            setSwipeImage(true);
        }
        else {
            setSwipeImage(false);
        }
    };

    const handleTouchMove = (event) => {

        if (isSwiping) {
            if (event.touches.length === 2) {
                event.preventDefault();

                const touch1 = event.touches[0];
                const touch2 = event.touches[1];
                const touchDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);

                if (prevTouchDistance !== null) {
                    if (touchDistance > prevTouchDistance) {
                        // Zooming out
                        setZoom(false);
                        setZoomReset(true);
                        setTransition(true); // Enable slide transition when zooming out

                        // Reset image translation and zoom when zoom is toggled off
                        const slides = slidesRef.current.getElementsByClassName('item');
                        const currentSlide = slides[slideIndex - 1];

                        if (currentSlide) {
                            const img = currentSlide.querySelector('img');
                            img.style.transform = '';
                        }

                        // remove class zoom-left and zoom-right in all item
                        const allItem = document.querySelectorAll('.item');
                        allItem.forEach((item) => {
                            item.classList.remove('zoom-left');
                            item.classList.remove('zoom-right');
                        });
                    } else if (touchDistance < prevTouchDistance) {
                        // Zooming in
                        setZoom(true);
                        setZoomReset(false);
                        setTransition(false); // Reset slide transition when zooming in

                        //remove class active in zoom button
                        document.querySelector('.button-zoom-prev').classList.remove('active');
                        document.querySelector('.button-zoom-next').classList.remove('active');

                        // Apply zoom transform to the image
                        const slides = slidesRef.current.getElementsByClassName('item');
                        const currentSlide = slides[slideIndex - 1];

                        if (currentSlide) {

                            const img = currentSlide.querySelector('img');
                            const imgWidth = img.offsetWidth;
                            var translateX = imgWidth / 6;

                            // check if two finger (touch 1, touch 2) touch in left or right of screen
                            const touch1 = event.touches[0];
                            const touch2 = event.touches[1];

                            if (touch1.clientX < window.innerWidth / 2 && touch2.clientX < window.innerWidth / 2) {
                                translateX = imgWidth / 6;

                                // add class active in zoom button class .button-prev
                                document.querySelector('.button-zoom-prev').classList.add('active');

                                // add class zoom-left to item active
                                document.querySelector('.item.active').classList.add('zoom-left');
                            }
                            else if (touch1.clientX > window.innerWidth / 2 && touch2.clientX > window.innerWidth / 2) {
                                translateX = -imgWidth / 6;

                                // add class active in zoom button class .button-next
                                document.querySelector('.button-zoom-next').classList.add('active');

                                // add class zoom-right to item active
                                document.querySelector('.item.active').classList.add('zoom-right');
                            }

                            // all image scale
                            const allImg = document.querySelectorAll('.item img');
                            allImg.forEach((img) => {
                                img.style.transform = `scale(1) translateX(${translateX}px)`;
                            });
                        }
                    }
                }

                setPrevTouchDistance(touchDistance);
            } else {
                const currentX = event.touches[0].clientX;
                const differenceX = startX - currentX;

                if (differenceX > 0) {
                    handleZoomButtonClick('right');
                } else if (differenceX < 0) {
                    handleZoomButtonClick('left');
                }
            }

            setIsSwiping(false);
        }

        if (swipeImage) {
            const currentX = event.touches[0].clientX;
            const differenceX = startX - currentX;

            if (differenceX > 0) {
                // click button next slide
                // document.querySelector('.button-next').click();
                nextSlide();
                setSwipeImage(false);
            } else if (differenceX < 0) {
                // click button previous slide
                // document.querySelector('.button-prev').click();
                previousSlide();
                setSwipeImage(false);  
            }

            // all image scale
            const allImg = document.querySelectorAll('.item img');
            allImg.forEach((img) => {
                img.style.transform = `scale(1) translateX(0px)`;
            });
        }
    };

    return (
        <>
            <div className="slider">
                <div className="group-button top">
                    <div className={`button-step5 button-prev ${slideIndex === 1 ? 'disable' : ''}`} onClick={previousSlide}>
                        <Prev />
                    </div>
                    <div className={`button-step5 button-next left ${slideIndex === props.image.length ? 'disable' : ''}`} onClick={nextSlide}>
                        <Next />
                    </div>
                    <div className={`button-step5 button-zoom right ${zoom && !zoomReset ? 'zoomed' : 'zoom'}`} onClick={handleZoom}>
                        <Zoom />
                    </div>
                </div>
                
                <div
                    className={`box ${zoom ? 'zoom' : ''} ${transition ? 'transition' : ''}`}
                    ref={slidesRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                >
                    {props.image.map((item, index) => (
                        <div className="item" key={index}>
                            <img src={item} alt="" />
                        </div>
                    ))}
                </div>

                <div className={`group-button bottom ${zoom ? 'zoom' : ''}`}>
                    
                    <div className={`button-step5 zoom-button button-zoom-prev`} onClick={() => handleZoomButtonClick('left')}>
                        <Prev />
                    </div>
                    <div className={`button-step5 zoom-button button-zoom-next`} onClick={() => handleZoomButtonClick('right')}>
                        <Next />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ZoomSlider;
