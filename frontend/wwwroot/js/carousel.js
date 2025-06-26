// Smoothly scrolls carousel to the selected item, accounting for spacers if present.
window.scrollCarouselToIndex = function (carouselListRef, paginationListRef, index, itemsAlwaysCentered) {
    // Helper to scroll a list by index
    function scrollToIndex(listRef, idx) {
        if (!listRef || typeof idx !== "number") return;

        // Skip the spacer if ItemsAlwaysCentered is enabled
        const elementIndex = itemsAlwaysCentered ? idx + 1 : idx;
        const item = listRef.children?.[elementIndex];

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

// Observes carousel items and notifies Blazor of the current index (handles spacers)
window.observeCarouselItems = (carouselListRef, dotNetHelper) => {
    const observerOptions = {
        root: carouselListRef,
        threshold: 0.6 // Item must be at least 60% visible
    };

    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                let index = Array.from(carouselListRef.children).indexOf(entry.target);
                if (itemsAlwaysCentered) index -= 1; // Subtract spacer
                dotNetHelper.invokeMethodAsync('UpdateCurrentIndex', index);
                break;
            }
        }
    }, observerOptions);

    Array.from(carouselListRef.children).forEach((item) => {
        observer.observe(item);
    });

    // Return a cleanup handle (not used by Blazor by default, but available)
    return {
        disconnect: () => observer.disconnect()
    };
};

// Enables drag/swipe to scroll carousel (with circular/infinite logic)
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
            if (dx < 0) {
                // Swipe left → next item (wrap)
                nextIndex = (currentIndex + 1) % itemCount;
            } else if (dx > 0) {
                // Swipe right → previous item (wrap)
                nextIndex = (currentIndex - 1 + itemCount) % itemCount;
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


/**
 * Prevents anchor navigation inside carousel slides if a drag/swipe occurred,
 * but allows normal clicks/taps to follow the link.
 *
 * Add 'carousel-slide-link' class to <a> tags inside carousel slides.
 */
(function () {
    let drag = { started: false, moved: false, threshold: 10, startX: 0, startY: 0 };

    function dragStart(e) {
        drag.started = true;
        drag.moved = false;
        drag.startX = e.touches ? e.touches[0].clientX : e.pageX;
        drag.startY = e.touches ? e.touches[0].clientY : e.pageY;
    }
    function dragMove(e) {
        if (!drag.started) return;
        let x = e.touches ? e.touches[0].clientX : e.pageX;
        let y = e.touches ? e.touches[0].clientY : e.pageY;
        let dx = Math.abs(x - drag.startX);
        let dy = Math.abs(y - drag.startY);
        if (dx > drag.threshold || dy > drag.threshold) {
            drag.moved = true;
        }
    }
    function dragEnd(e) {
        drag.started = false;
    }

    // This blocks click on links if a drag happened
    document.addEventListener('click', function (e) {
        if (drag.moved && e.target.closest('.carousel-slide-link')) {
            e.preventDefault();
            drag.moved = false; // reset
        }
    }, true);

    // Attach handlers to carousel only (you can make this more selective)
    document.addEventListener('mousedown', function (e) {
        if (e.target.closest('.carousel-item')) dragStart(e);
    });
    document.addEventListener('mousemove', function (e) {
        dragMove(e);
    });
    document.addEventListener('mouseup', function (e) {
        dragEnd(e);
    });

    document.addEventListener('touchstart', function (e) {
        if (e.target.closest('.carousel-item')) dragStart(e);
    }, { passive: false });
    document.addEventListener('touchmove', function (e) {
        dragMove(e);
    }, { passive: false });
    document.addEventListener('touchend', function (e) {
        dragEnd(e);
    });
})();
