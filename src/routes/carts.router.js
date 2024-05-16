const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cart-manager.js");
const cartManager = new CartManager("./src/models/carts.json");


//CREATE
router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        console.error("Error while creating new cart", error);
        res.status(500).json({ error: "Internal error 😱 1" });
    }
});
//GET
router.get("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid);

    try {
        const carrito = await cartManager.getCarritoById(cartId);
        res.json(carrito.products);
    } catch (error) {
        console.error("Error obtaining cart", error);
        res.status(500).json({ error: "Internal error 😱 2" });
    }
});
//POST
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
        res.json(actualizarCarrito.products);
    } catch (error) {
        console.error("Error adding to cart", error);
        res.status(500).json({ error: "Internal error 😱 3" });
    }
});
//PUT
router.put("/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = req.params.pid;
    const newProductId = req.body.newProduct;

    try {
        const updatedCart = await cartManager.actualizarProductoEnCarrito(cartId, productId, newProductId);
        res.json(updatedCart.products);
    } catch (error) {
        console.error("Error updating cart", error);
        res.status(500).json({ error: "Internal error 😱 4" });
    }
});

//PUT2
router.put("/:cid/product/:pid/quantity", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    try {
        const updatedCart = await cartManager.actualizarCantidadDeProductoEnCarrito(cartId, productId, newQuantity);
        res.json(updatedCart.products);
    } catch (error) {
        console.error("Couldn't update product on cart", error);
        res.status(500).json({ error: "Internal error 😱" });
    }
});

//DELETE
router.delete("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid);

    try {
        await cartManager.vaciarCarrito(cartId);
        res.json({ message: "Cart is empty!" });
    } catch (error) {
        console.error("We couldn't empty your cart", error);
        res.status(500).json({ error: "Internal error 😱" });
    }
});


module.exports = router;
