//window.scrollCarousel = (element, toRight) => {
//    const distance = 200;

//    if (element) {
//        element.scrollBy({
//            left: toRight ? distance : -distance,
//            behavior: 'smooth'
//        });
//    }
//};

window.scrollCarouselToIndex = function (carouselListRef, index) {
    if (!carouselListRef || !carouselListRef.children || index >= carouselListRef.children.length)
        return;

    const itemWidth = carouselListRef.children[0].offsetWidth;
    const gap = parseInt(getComputedStyle(carouselListRef).gap || 0);
    const scrollAmount = index * (itemWidth + gap);

    carouselListRef.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
    });
};
