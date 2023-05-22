import productModel from "../models/products.model.js"
import ManagerAcces from "./managerAccess.js"

const managerAccess = new ManagerAcces();
export default class ProductManagerMongo {
    async addProduct(productData) {
        const { title, description, price, category, thumbnail, code, stock } = productData;
        if (!title || !description || !price || !category || !thumbnail || !code || !stock) {
            throw new Error("Faltan datos");
        };
        const product = { title, description, price, category, thumbnail, code, stock };
        const result = await productModel.create(product);
        await managerAccess.createRecord('CREATE NEW PRODUCT');
        return result;
    };
};