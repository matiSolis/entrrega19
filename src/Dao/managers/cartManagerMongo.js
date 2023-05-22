import cartModel from "../models/cart.model.js";
import productModel from "../models/products.model.js";
import ManagerAcces from "./managerAccess.js"

const managerAccess = new ManagerAcces();

export default class CartManagerMongo {
    async getDetailsInCart (idCart) {
        const cart = await cartModel.findById(idCart).populate('products.product');
        await managerAccess.createRecord('GET PRODUCTS DETAILS IN CART');
        return cart;
    };
    async addProductInCart (idCart, idProduct) {
        const findProduct = await productModel.findOne({_id: idProduct});
        const alreadyInCart = await cartModel.findOne({products: {$elemMatch: {product: findProduct._id}}});
        if (!alreadyInCart) {
            await cartModel.updateOne({_id: idCart}, {$push: {products: {product: findProduct._id, quantity: 1}}});
        } else {
            alreadyInCart.products.find(p => p.product.equals(findProduct._id)).quantity += 1;
            await managerAccess.createRecord('ADD PRODUCT IN CART');
            await alreadyInCart.save();
        };
    };
    async clearCart (idCart){
        const cart = await cartModel.findById(idCart);
        cart.products = [];
        await cart.save();
        await managerAccess.createRecord('EMPTY CART');
        return cart;
    };
    async updateProductQuantity (cartId, productId, quantity) {
        const cart = await cartModel.findById(cartId);
        const productIndex = cart.products.findIndex(
            (product) => product.product.toString() === productId
        );
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            await managerAccess.createRecord('UPDATE PRODUCT QUANTITY');
        } else {
            throw new Error("El producto no se encontró en el carrito");
        };
    };
    //Esta funcion no me anda, no la puedo resolver
    async addProductsToCart (idCart, products) {
        const cart = await cartModel.findById(idCart);
        for (const product of products) {
            const alreadyInCart = await cartModel.findOne({products: {$elemMatch: {product: product._id}}});
            if (alreadyInCart) {
                alreadyInCart.quantity = product.quantity;
                await cart.save();
            } else {
                cart.products.push({
                    product: product._id,
                    quantity: product.quantity,
                });
                await cart.save();
            };
        };
        await managerAccess.createRecord('ADD PRODUCTS TO CART');
    };
};