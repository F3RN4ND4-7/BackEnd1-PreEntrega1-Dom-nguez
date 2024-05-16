const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/product-manager.js");
const productManager = new ProductManager("./src/models/productos.json");

router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit;
        const productos = await productManager.getProducts();
        if (limit) {
            res.json(productos.slice(0, limit));
        } else {
            res.json(productos);
        }
    } catch (error) {
        console.error("Error finding products", error);
        res.status(500).json({
            error: "Server Error 😅"
        });
    }
});

router.get("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const producto = await productManager.getProductById(parseInt(id));
        if (!producto) {
            return res.status(404).json({
                error: "Product not found 🤦🏻‍♀️"
            });
        }

        res.json(producto);
    } catch (error) {
        console.error("Error finding product", error);
        res.status(500).json({
            error: "Server Error 😅"
        });
    }
});

router.post("/", async (req, res) => {
    const nuevoProducto = req.body;

    try {
        await productManager.addProduct(nuevoProducto);
        res.status(201).json({
            message: "Product added"
        });
    } catch (error) {
        console.error("Error adding product", error);
        res.status(500).json({
            error: "Server Error 😅"
        });
    }
});

router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const productoActualizado = req.body;

    try {
        await productManager.updateProduct(parseInt(id), productoActualizado);
        res.json({
            message: "Product updated"
        });
    } catch (error) {
        console.error("Error updating product", error);
        res.status(500).json({
            error: "Internal Error 😱"
        });
    }
});

router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        await productManager.deleteProduct(parseInt(id));
        res.json({
            message: "Product deleted"
        });
    } catch (error) {
        console.error("Error deleting product", error);
        res.status(500).json({
            error: "Internal Error 😱"
        });
    }
});

module.exports = router;
