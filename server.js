const http = require("http");
const url = require('url');

function start(route, handle) {
    function onRequest(req, res) {
        const baseURL = `http://${req.headers.host}`;
        const myURL = new URL(req.url, baseURL);
        let pathname = myURL.pathname;
        let productId = myURL.searchParams.get('productId');

        route(pathname, handle, res, productId);
    }
    
    http.createServer(onRequest).listen(8888);
}

exports.start = start;