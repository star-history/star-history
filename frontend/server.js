const { createServer } = require("http")
const { parse } = require("url")
const next = require("next")
const findFreePort = require("find-free-port");

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

const startServer = (port) => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        const { pathname } = parsedUrl;

        // Redirect to lowercase URL
        if (pathname && pathname !== pathname.toLowerCase()) {
            const lowercasePathname = pathname.toLowerCase();
            const query = Object.assign({}, parsedUrl.query);
            app.render(req, res, lowercasePathname, query);
        } else {
            handle(req, res, parsedUrl);
        }
    });

    server.listen(port, () => {
        console.log(`Ready on http://localhost:${port}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Port ${port} is already in use.`);
            process.exit(1);
        } else {
            throw err;
        }
    });
};

app.prepare().then(() => {
    if (dev) {
        // In development mode, start server on the first available port starting from 3000
        findFreePort(3000, (err, freePort) => {
            if (err) throw err;
            startServer(freePort);
        });
    } else {
        // In production mode, use the port specified by the PORT environment variable or default to 8080
        const port = parseInt(process.env.PORT, 10) || 8080;
        startServer(port);
    }
});