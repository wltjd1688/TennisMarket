const fs = require('fs');
const main_view = fs.readFileSync('main.html','utf-8');
const orederlist_view = fs.readFileSync('orderlist.html','utf-8');

const mariadb = require('./database/connect/mariadb');

function styleCss(response) {
    response.writeHead(200, {'Content-Type': 'text/css'});
    response.write(fs.readFileSync('main.css','utf-8'));
    response.end();
}

function main(response) {
    console.log('main');
    
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(main_view);
    response.end();
};

function redRacket(response) {
    fs.readFile('./img/redRacket.png', function(err, data) {
        response.writeHead(200, {'Content-Type': 'image/png'});
        response.write(data);
        response.end();
    })
}

function blackRacket(response) {
    fs.readFile('./img/blackRacket.png', function(err, data) {
        response.writeHead(200, {'Content-Type': 'image/png'});
        response.write(data);
        response.end();
    })
}

function blueRacket(response) {
    fs.readFile('./img/blueRacket.png', function(err, data) {
        response.writeHead(200, {'Content-Type': 'image/png'});
        response.write(data);
        response.end(); 
    })
}

function order(response, productId) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    let nowDate = new Date().toISOString().split('T')[0]; 

    
    mariadb.query("SELECT * FROM orderlist WHERE product_id="+ productId +";", function(err, rows) {
        try{
            if (rows.length > 0 || productId === null){
                console.log('Already ordered');
            } else {
                insertOrder();
            }
            displayOrder();
        } catch(err){
            console.log(err);
        }
    });
    
    function insertOrder() {
        mariadb.query("INSERT INTO orderlist VALUES (" + productId + ", '" + nowDate + "');", function(err, rows){
            try{
                console.log(rows);
                console.log('Order inserted');
            }
            catch(err){
                console.log(err);
                console.log('Order insertion failed');
            }
        });
    }

    function displayOrder(){
        let sql = `
            SELECT p.*, o.order_data 
            FROM product AS p 
            RIGHT JOIN orderlist AS o ON p.id = o.product_id`
        ;

        mariadb.query(sql, function(err, rows){
            if (rows){
                let tableTemplate = (order_product) =>`
                    <tr>
                        <td>${order_product.id}</td>
                        <td>${order_product.name}</td>
                        <td>${order_product.description }</td>
                        <td>${order_product.print}</td>
                        <td>${order_product.order_data}</td>
                    </tr>`;
                let orderlistHtmk = rows.map((value) => tableTemplate(value)).join('');
                let template = `
                            <table class="orderlist_box">
                                <thead>
                                    <tr>
                                        <th>Product ID</th>
                                        <th>Product Name</th>
                                        <th>Description</th>
                                        <th>Print</th>
                                        <th>Order Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${orderlistHtmk}
                                </tbody>
                            </table>
                `
                response.write(orederlist_view);
                response.write(template);
                response.end();

            } else {
                console.log('No order');
            }
        });
    }
}

let handle = {}; // key:value
handle['/'] = main;
handle['/order'] = order;
handle['/main.css'] = styleCss;

/* image directory */
handle['/img/redRacket.png'] = redRacket;
handle['/img/blackRacket.png'] = blackRacket;
handle['/img/blueRacket.png'] = blueRacket;

exports.handle = handle;