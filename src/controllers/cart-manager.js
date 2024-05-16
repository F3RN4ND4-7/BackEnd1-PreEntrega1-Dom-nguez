const fs = require("fs").promises;

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.ultId = 0;

        this.cargarCarritos();
    }

    async cargarCarritos() {
        try {
            const data = await fs.readFile(this.path, "utf8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                this.ultId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.error("An error ocurred while uploading cart from server", error);
            await this.guardarCarritos();
        }
    }

    async guardarCarritos() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async crearCarrito() {
        const nuevoCarrito = {
            id: ++this.ultId,
            products: []
        };
        this.carts.push(nuevoCarrito);
        await this.guardarCarritos();
        return nuevoCarrito;
    }

    async getCarritoById(cartId) {
        try {
            const carrito = this.carts.find(c => c.id === cartId);
            if (!carrito) {
                throw new Error(`There's no cart ID ${cartId}`);
            }
            return carrito;
        } catch (error) {
            console.error("We couldn't reach the cart ID", error);
            throw error;
        }
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        const carrito = await this.getCarritoById(cartId);
        const existeProducto = carrito.products.find(p => p.product === productId);

        if (existeProducto) {
            existeProducto.quantity += quantity;
        } else {
            carrito.products.push({ product: productId, quantity });
        }

        await this.guardarCarritos();
        return carrito;
    }

    async vaciarCarrito(cartId) {
        const carrito = await this.getCarritoById(cartId);
        carrito.products = [];
        await this.guardarCarritos();
    }


    async actualizarProductoEnCarrito(cartId, productId, newProductId){
        const carrito = await this.getCarritoById(cartId);

        let indexProductId = carrito.products.findIndex(product => product.product === productId);
        if(indexProductId === -1)  throw 'Product not found';

        carrito.products[indexProductId].product =  String(newProductId);
        await this.guardarCarritos();
        return carrito
    }
    
}

module.exports = CartManager;


