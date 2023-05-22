const socket = io();
let log = document.getElementById('productList');

const addProd = document.getElementById("addProd");
addProd.addEventListener("click", event =>{
    if(event){
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;
        const thumbnail = document.getElementById('thumbnail').value;
        const code = document.getElementById('code').value;
        const stock = document.getElementById('stock').value;
        const newProduct = {title,
                            description,
                            price,
                            thumbnail,
                            code,
                            stock};
        socket.emit('productAdd', newProduct);
    }
});

const deletProd = document.getElementById("deletProd");
deletProd.addEventListener("click", event =>{
    if(event){
        const pid = document.getElementById('pid').value;
        socket.emit('productDeleted', pid);
    }
});

socket.on('productList', products =>{
    let productListHTML = "";
    products.forEach(producto => {
        productListHTML +=  `<p>==========</p>
        ${producto.pid}<br/>
        ${producto.title}<br/>
        ${producto.description}<br/>
        ${producto.price}<br/>
        ${producto.thumbnail}<br/>
        ${producto.status}<br/>
        ${producto.code}<br/>
        ${producto.stock}<br/>`
    });
    log.innerHTML = productListHTML;

})

