window.monitorFileInputClear = (input, dotNetHelper, propName) => {
    console.log("monitorFileInputClear called for property: " + propName);
    // input is the actual <input type="file"> DOM element
    if (input) {
        console.log("1");
        input.addEventListener('input', function () {
            console.log("2");
            if (input.files.length === 0) {
                console.log("3");
                dotNetHelper.invokeMethodAsync("OnFileCleared", propName);
            }
        });
    }
};