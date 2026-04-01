// Smoothly scrolls carousel to the selected item, accounting for spacers if present.
window.scrollCarouselToIndex = function (
    carouselListRef,
    paginationListRef,
    index,
    itemsAlwaysCentered,
    smooth = true
) {
    // Returns the real DOM child index, accounting for the optional spacer item.
    function getElementIndex(idx) {
        return itemsAlwaysCentered ? idx + 1 : idx;
    }

    // Scroll one list so that the target item is centered.
    function scrollToIndex(listRef, idx) {
        if (!listRef || typeof idx !== "number") return;

        const elementIndex = getElementIndex(idx);
        const item = listRef.children?.[elementIndex];

        if (!item) return;

        const listRect = listRef.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        // Calculate how far the item center is from the list center.
        const currentScrollLeft = listRef.scrollLeft;
        const scrollOffset =
            (itemRect.left + itemRect.width / 2) -
            (listRect.left + listRect.width / 2);

        listRef.scrollTo({
            left: currentScrollLeft + scrollOffset,
            behavior: smooth ? "smooth" : "auto"
        });
    }

    scrollToIndex(carouselListRef, index);
    scrollToIndex(paginationListRef, index);
};

// Observes carousel items and notifies Blazor of the current index (handles spacers)
window.observeCarouselItems = (carouselListRef, dotNetHelper, itemsAlwaysCentered) => {
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
// Enables drag/swipe navigation for the carousel.
// This version always asks Blazor for the latest current index at swipe end,
// instead of using a stale captured index from initialization time.
window.enableDirectionalSwipeScroll = function (carouselListRef, dotNetHelper, itemCount) {
    if (!carouselListRef) return;

    // Clean up previous handlers before attaching new ones.
    // This avoids duplicate listeners after re-renders.
    if (carouselListRef._swipeHandlersAdded) {
        carouselListRef.removeEventListener('mousedown', carouselListRef._swipeStartHandler);
        carouselListRef.removeEventListener('touchstart', carouselListRef._swipeStartHandler);
        window.removeEventListener('mouseup', carouselListRef._swipeEndHandler);
        carouselListRef.removeEventListener('touchend', carouselListRef._swipeEndHandler);
        window.removeEventListener('mouseleave', carouselListRef._swipeCancelHandler);
        carouselListRef.removeEventListener('touchcancel', carouselListRef._swipeCancelHandler);
        //carouselListRef.removeEventListener('touchmove', carouselListRef._swipeMoveHandler);
    }

    let swipeInProgress = false;
    let startX = 0;
    let startY = 0;

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

    // Must be async because we await a .NET interop call.
    async function swipeEndHandler(e) {
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

        // Only treat the gesture as a swipe if horizontal movement is large enough.
        if (Math.abs(dx) > threshold) {
            // Ask Blazor for the latest active index at swipe end.
            const currentIndex = await dotNetHelper.invokeMethodAsync('GetCurrentIndex');
            let nextIndex = currentIndex;

            if (dx < 0) {
                // Swipe left -> go to next item (with wraparound).
                nextIndex = (currentIndex + 1) % itemCount;
            } else if (dx > 0) {
                // Swipe right -> go to previous item (with wraparound).
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

    // Store references for future cleanup.
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

// function that waits for stable layout and then centers the carousel and pagination to the specified index
window.initializeCarouselPosition = async function (carouselListRef, paginationListRef, index, itemsAlwaysCentered) {
    if (!carouselListRef) return;

    function getItem(listRef, idx) {
        if (!listRef || typeof idx !== "number") return null;
        const elementIndex = itemsAlwaysCentered ? idx + 1 : idx;
        return listRef.children?.[elementIndex] ?? null;
    }

    function centerItem(listRef, idx, smooth) {
        if (!listRef) return;

        const item = getItem(listRef, idx);
        if (!item) return;

        const listRect = listRef.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        const currentScrollLeft = listRef.scrollLeft;
        const scrollOffset =
            (itemRect.left + itemRect.width / 2) -
            (listRect.left + listRect.width / 2);

        listRef.scrollTo({
            left: currentScrollLeft + scrollOffset,
            behavior: smooth ? "smooth" : "auto"
        });
    }

    function getSignature() {
        const item = getItem(carouselListRef, index);
        if (!item) return null;

        const listRect = carouselListRef.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        // Signature representing the current geometry
        return [
            Math.round(listRect.width),
            Math.round(listRect.left),
            Math.round(itemRect.width),
            Math.round(itemRect.left)
        ].join("|");
    }

    // Wait until layout stops changing across a few animation frames
    await new Promise((resolve) => {
        let stableCount = 0;
        let lastSignature = null;
        let attempts = 0;
        const maxAttempts = 60; // ~1 second at 60fps

        function check() {
            attempts++;

            const signature = getSignature();

            if (signature && signature === lastSignature) {
                stableCount++;
            } else {
                stableCount = 0;
                lastSignature = signature;
            }

            if (stableCount >= 3 || attempts >= maxAttempts) {
                resolve();
                return;
            }

            requestAnimationFrame(check);
        }

        requestAnimationFrame(check);
    });

    // Initial positioning should be immediate, not smooth.
    // Reuse the main scroll helper so all centering logic stays consistent.
    window.scrollCarouselToIndex(
        carouselListRef,
        paginationListRef,
        index,
        itemsAlwaysCentered,
        false
    );
};

// Observes carousel and its items for size changes, and re-centers to the current index when that happens
window.attachCarouselResizeObserver = function (carouselListRef, paginationListRef, dotNetHelper, itemsAlwaysCentered) {
    if (!carouselListRef) return;

    if (carouselListRef._resizeObserver) {
        carouselListRef._resizeObserver.disconnect();
    }

    let frameRequested = false;

    const observer = new ResizeObserver(() => {
        if (frameRequested) return;

        frameRequested = true;
        requestAnimationFrame(async () => {
            frameRequested = false;

            const currentIndex = await dotNetHelper.invokeMethodAsync("GetCurrentIndex");

            // Re-center instantly on resize/layout changes.
            // Smooth animation here can look jumpy or laggy.
            window.scrollCarouselToIndex(
                carouselListRef,
                paginationListRef,
                currentIndex,
                itemsAlwaysCentered,
                false
            );
        });
    });

    observer.observe(carouselListRef);

    Array.from(carouselListRef.children).forEach((child) => {
        observer.observe(child);
    });

    carouselListRef._resizeObserver = observer;
};