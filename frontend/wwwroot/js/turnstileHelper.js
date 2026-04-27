window.turnstileHelper = (() => {
    let widgetId = null;

    function waitForTurnstile() {
        return new Promise((resolve) => {
            const check = () => {
                if (window.turnstile) {
                    resolve(window.turnstile);
                    return;
                }

                setTimeout(check, 100);
            };

            check();
        });
    }

    async function render(containerId, siteKey, dotNetRef) {
        const turnstile = await waitForTurnstile();

        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Turnstile container '${containerId}' not found.`);
            return;
        }

        // Clear previous widget if this page gets re-rendered
        container.innerHTML = "";

        widgetId = turnstile.render(container, {
            sitekey: siteKey,

            callback: function (token) {
                dotNetRef.invokeMethodAsync("OnTurnstileSuccess", token);
            },

            "expired-callback": function () {
                dotNetRef.invokeMethodAsync("OnTurnstileExpired");
            },

            "error-callback": function () {
                dotNetRef.invokeMethodAsync("OnTurnstileError");
            }
        });
    }

    function reset() {
        if (window.turnstile && widgetId !== null) {
            window.turnstile.reset(widgetId);
        }
    }

    function remove() {
        if (window.turnstile && widgetId !== null) {
            window.turnstile.remove(widgetId);
            widgetId = null;
        }
    }

    return {
        render,
        reset,
        remove
    };
})();