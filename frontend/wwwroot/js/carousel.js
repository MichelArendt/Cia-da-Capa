window.scrollCarouselToIndex = function (carouselListRef, paginationListRef, index) {
    // Helper to scroll a list by index
    function scrollToIndex(listRef, idx) {
        if (!listRef || typeof idx !== "number") return;
        const item = listRef.children?.[idx];
        if (!item) return;

        const listRect = listRef.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        const currentScrollLeft = listRef.scrollLeft;
        const scrollOffset = (itemRect.left + itemRect.width / 2) - (listRect.left + listRect.width / 2);

        listRef.scrollTo({
            left: currentScrollLeft + scrollOffset,
            behavior: 'smooth'
        });
    }

    scrollToIndex(carouselListRef, index);
    scrollToIndex(paginationListRef, index);
};

window.observeCarouselItems = (carouselListRef, dotNetHelper) => {
    const observerOptions = {
        root: carouselListRef,
        threshold: 0.6 // Item must be at least 60% visible
    };

    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                const index = Array.from(carouselListRef.children).indexOf(entry.target);
                dotNetHelper.invokeMethodAsync('UpdateCurrentIndex', index);
                break;
            }
        }
    }, observerOptions);

    Array.from(carouselListRef.children).forEach((item) => {
        observer.observe(item);
    });

    // Return a cleanup handle
    return {
        disconnect: () => observer.disconnect()
    };
};

window.enableDirectionalSwipeScroll = function (carouselListRef, dotNetHelper, itemCount, currentIndex) {
    if (!carouselListRef) return;

    // Clean up previous handlers
    if (carouselListRef._swipeHandlersAdded) {
        carouselListRef.removeEventListener('mousedown', carouselListRef._swipeStartHandler);
        carouselListRef.removeEventListener('touchstart', carouselListRef._swipeStartHandler);
        window.removeEventListener('mouseup', carouselListRef._swipeEndHandler);
        carouselListRef.removeEventListener('touchend', carouselListRef._swipeEndHandler);
        window.removeEventListener('mouseleave', carouselListRef._swipeCancelHandler);
        carouselListRef.removeEventListener('touchcancel', carouselListRef._swipeCancelHandler);
        carouselListRef.removeEventListener('touchmove', carouselListRef._swipeMoveHandler);
    }
    let swipeInProgress = false;
    let startX = 0, startY = 0;

    function swipeStartHandler(e) {
        if (e.type === 'touchstart' && e.touches && e.touches.length === 1) {
            swipeInProgress = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        } else if (e.type === 'mousedown' && e.button === 0) {
            swipeInProgress = true;
            startX = e.pageX;
            startY = e.pageY;
        }
    }

    function swipeEndHandler(e) {
        if (!swipeInProgress) return;
        let endX = 0;
        if (e.type === 'touchend' && e.changedTouches && e.changedTouches.length > 0) {
            endX = e.changedTouches[0].clientX;
        } else if (e.type === 'mouseup') {
            endX = e.pageX;
        } else {
            swipeInProgress = false;
            return;
        }

        let dx = endX - startX;
        let threshold = 30;
        let nextIndex = currentIndex;
        if (Math.abs(dx) > threshold) {
            if (dx < 0 && currentIndex < itemCount - 1) {
                nextIndex = currentIndex + 1;
            } else if (dx > 0 && currentIndex > 0) {
                nextIndex = currentIndex - 1;
            }
            if (nextIndex !== currentIndex) {
                dotNetHelper.invokeMethodAsync('ScrollToIndex', nextIndex);
            }
        }
        swipeInProgress = false;
    }

    function swipeCancelHandler() {
        swipeInProgress = false;
    }

    carouselListRef.addEventListener('mousedown', swipeStartHandler);
    carouselListRef.addEventListener('touchstart', swipeStartHandler, { passive: false });
    window.addEventListener('mouseup', swipeEndHandler);
    carouselListRef.addEventListener('touchend', swipeEndHandler);
    window.addEventListener('mouseleave', swipeCancelHandler);
    carouselListRef.addEventListener('touchcancel', swipeCancelHandler);

    carouselListRef._swipeStartHandler = swipeStartHandler;
    carouselListRef._swipeEndHandler = swipeEndHandler;
    carouselListRef._swipeCancelHandler = swipeCancelHandler;
    carouselListRef._swipeHandlersAdded = true;
};
