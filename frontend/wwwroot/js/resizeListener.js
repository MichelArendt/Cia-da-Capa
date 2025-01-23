// Define an object named `resizeListener` for managing resize events and interaction with Blazor components
window.resizeListener = {
    /**
     * Initialize the resize listener.
     * This function is called to set up the resize listener and pass a reference to a Blazor .NET object.
     *
     * @param {DotNetObjectReference} dotNetHelper - A Blazor .NET object reference for invoking Blazor methods from JavaScript.
     */
    initialize: function (dotNetHelper, desktopBreakpoint) {
        // Store the Blazor .NET object reference for later use
        this.dotNetHelper = dotNetHelper;

        // Bind the `onResize` function to the current object context
        // This ensures that `this` inside `onResize` refers to the `resizeListener` object
        this.boundOnResize = this.onResize.bind(this);

        // Add the resize event listener to the window object
        // The `onResize` method will be triggered whenever the browser window is resized
        window.addEventListener("resize", this.boundOnResize);
    },

    /**
     * Dispose of the resize listener.
     * This function removes the resize event listener and cleans up the Blazor .NET object reference.
     */
    dispose: function () {
        // Check if the resize event listener was previously bound
        if (this.boundOnResize) {
            // Remove the resize event listener from the window object
            window.removeEventListener("resize", this.boundOnResize);
        }

        // Clear the Blazor .NET object reference to free up memory and avoid potential issues
        this.dotNetHelper = null;
    },

    /**
     * Handle the resize event.
     * This function is triggered whenever the window is resized.
     */
    onResize: function () {
        // Check if the Blazor .NET object reference is available
        if (this.dotNetHelper) {
            // Invoke the `UpdateDimensionsAsync` method on the Blazor .NET object asynchronously
            // This allows Blazor to handle the resize event and update its state accordingly
            this.dotNetHelper.invokeMethodAsync("UpdateDimensionsAsync");
        }
    },

    /**
     * Get the current dimensions of the browser window.
     * This function returns the width and height of the window.
     *
     * @returns {Object} - An object containing the width and height of the window.
     */
    getDimensions: function () {
        // Return an object with the current width and height of the browser window
        return {
            width: window.innerWidth,  // The inner width of the window's content area
            height: window.innerHeight // The inner height of the window's content area
        };
    },
};
