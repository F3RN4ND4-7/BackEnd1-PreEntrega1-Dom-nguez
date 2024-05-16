const express = require("express");
const app = express();
const PUERTO = 8080;
const ProductManager = require("./controllers/product-manager.js");
const productManager = new ProductManager("./src/models/productos.json");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");


//EXPRESS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ROUTES
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//LISTENING
app.listen(PUERTO, () => {
    console.log(`Hey!The server is listening in port ${PUERTO}`);
});

