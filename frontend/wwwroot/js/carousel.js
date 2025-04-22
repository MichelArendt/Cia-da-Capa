window.scrollCarousel = (element, toRight) => {
    const distance = 200;

    if (element) {
        element.scrollBy({
            left: toRight ? distance : -distance,
            behavior: 'smooth'
        });
    }
};