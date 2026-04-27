(function () {
    const isLocal =
        location.hostname === "localhost" ||
        location.hostname === "127.0.0.1";

    const script = document.createElement("script");

    script.src = isLocal
        ? "config.local.js"
        : "config.production.js";

    document.head.appendChild(script);
})();