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

window.phoneMask = window.phoneMask || {};

window.phoneMask.format = function (rawValue) {
    const digits = (rawValue || "").replace(/\D/g, "").slice(0, 11);

    if (digits.length === 0) {
        return "";
    }

    // (xx) xxxx-xxxx
    if (digits.length <= 10) {
        const ddd = digits.slice(0, 2);
        const first = digits.slice(2, 6);
        const second = digits.slice(6, 10);

        if (digits.length <= 2) {
            return `(${ddd}`;
        }

        if (digits.length <= 6) {
            return `(${ddd}) ${first}`;
        }

        return `(${ddd}) ${first}-${second}`;
    }

    // (xx) x-xxxx-xxxx
    const ddd = digits.slice(0, 2);
    const first = digits.slice(2, 3);
    const second = digits.slice(3, 7);
    const third = digits.slice(7, 11);

    if (digits.length <= 2) {
        return `(${ddd}`;
    }

    if (digits.length <= 3) {
        return `(${ddd}) ${first}`;
    }

    if (digits.length <= 7) {
        return `(${ddd}) ${first}-${second}`;
    }

    return `(${ddd}) ${first}-${second}-${third}`;
};

window.phoneMask.attach = function (element, dotNetRef) {
    if (!element) {
        return;
    }

    const syncValue = () => {
        const formatted = window.phoneMask.format(element.value);
        element.value = formatted;
        dotNetRef.invokeMethodAsync("UpdatePhone", formatted);
    };

    element.addEventListener("input", syncValue);
    element.addEventListener("change", syncValue);
    element.addEventListener("blur", syncValue);

    // Important for browser autofill
    setTimeout(syncValue, 0);
};