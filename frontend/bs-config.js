module.exports = {
    proxy: "http://localhost:5038", // Proxy your .NET app
    port: 3000, // Serve on port 3000
    files: ["wwwroot/css/**/*.css"], // Watch for changes in CSS
    serveStatic: ["wwwroot"], // Serve static files from 'wwwroot'
    middleware: [
        {
            route: "/api",
            handle: (req, res, next) => {
                const httpProxy = require("http-proxy");
                const proxy = httpProxy.createProxyServer({
                    target: "http://localhost:80", // Proxy API calls to the API server
                    changeOrigin: true,
                });
                proxy.web(req, res, next);
            },
        },
    ],
    open: false,
    notify: false,
};
