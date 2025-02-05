function route(pathname, handle, response, productId) {
    console.log("pathname : " + pathname);

    if(typeof handle[pathname] === 'function'){
        handle[pathname](response, productId);
    } else {
        response.writeHead(400, {'Content-Type': 'text/html'});
        response.write('not find');
        response.end();
    }

}

exports.route = route;