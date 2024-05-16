const fs = require("fs").promises;

class ProductManager {
  static ultId = 0;

  constructor(path) {
    this.path = path;
  }

  async addProduct({ id, title, description, price, img, code, stock, category, thumbnails }) {
    try {
      const arrayProductos = await this.readFromFile();

      if (!title || !description || !price || !code || !stock || !category) {
        console.log("Please enter all the information.");
        return;
      }

      if (arrayProductos.some(item => item.code === code)) {
        console.log("Please enter a unique code.");
        return;
      }

      const newProduct = {
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnails || []
      };

      if (arrayProductos.length > 0) {
        ProductManager.ultId = arrayProductos.reduce((maxId, product) => Math.max(maxId, product.id), 0);
      }

      newProduct.id = ++ProductManager.ultId; 

      arrayProductos.push(newProduct);
      await this.saveToFile(arrayProductos);
    } catch (error) {
      console.log("Failed to add the product", error);
      throw error; 
    }
  }

  async getProducts() {
    try {
      return await this.readFromFile();
    } catch (error) {
      console.log("Error reading file:", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const arrayProductos = await this.readFromFile();
      const foundProduct = arrayProductos.find(item => item.id === id);

      if (!foundProduct) {
        console.log("Product not found.");
        return null;
      } else {
        console.log("Product found!!!");
        return foundProduct;
      }
    } catch (error) {
      console.log("Error reading file:", error);
      throw error;
    }
  }

  async readFromFile() {
    try {
      const response = await fs.readFile(this.path, "utf-8");
      return JSON.parse(response);
    } catch (error) {
      console.log("Error reading file:", error);
      throw error;
    }
  }

  async saveToFile(arrayProductos) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.log("Error saving the product", error);
      throw error;
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const arrayProductos = await this.readFromFile();

      const index = arrayProductos.findIndex(item => item.id === id);

      if (index !== -1) {
        arrayProductos[index] = { ...arrayProductos[index], ...updatedProduct };
        await this.saveToFile(arrayProductos);
        console.log("Product updated");
      } else {
        console.log("Product not found.");
      }
    } catch (error) {
      console.log("Error updating product:", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const arrayProductos = await this.readFromFile();

      const index = arrayProductos.findIndex(item => item.id === id);

      if (index !== -1) {
        arrayProductos.splice(index, 1);
        await this.saveToFile(arrayProductos);
        console.log("Product deleted");
      } else {
        console.log("Product not found.");
      }
    } catch (error) {
      console.log("Error deleting the product", error);
      throw error;
    }
  }
}

module.exports = ProductManager;
