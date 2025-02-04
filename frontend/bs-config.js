module.exports = {
    proxy: "http://localhost",
    port: 3000,
    files: ["../build/**/*.{css,scss,js,html}"],
    serveStatic: ["../build"],
    open: false,
    notify: false,
    logLevel: "debug",
};
