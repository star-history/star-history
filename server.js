const { createServer } = require("http")
const { parse } = require("url")
const next = require("next")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    createServer((req, res) => {
        const parsedUrl = parse(req.url, true)
        const { pathname } = parsedUrl

        // Redirect to lowercase URL
        if (pathname && pathname !== pathname.toLowerCase()) {
            const lowercasePathname = pathname.toLowerCase()
            const query = Object.assign({}, parsedUrl.query)
            app.render(req, res, lowercasePathname, query)
        } else {
            handle(req, res, parsedUrl)
        }
    }).listen(3000, (err) => {
        if (err) throw err
        console.log("> Ready on http://localhost:3000")
    })
})
