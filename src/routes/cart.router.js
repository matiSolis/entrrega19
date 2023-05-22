import { Router } from "express";
import CartManagerMongo from "../Dao/managers/cartManagerMongo.js";
import ManagerAcces from "../Dao/managers/managerAccess.js";
import cartModel from "../Dao/models/cart.model.js";

const router = Router();
const cartManagerMongo = new CartManagerMongo();
const managerAccess = new ManagerAcces();

router.get('/', async (req, res) => {
    try {
        const result = await cartModel.find();
        await managerAccess.createRecord('GET CARTS');
        res.status(200).send({
            status: "success",
            result
        });
    }catch(error){
        res.status(400).send({
            status: "Error",
            msg: `El total de carritos no se puede visualizar.`
        });
    };
});
router.get('/:cid', async (req, res) => {
    try{
        const idCart = req.params.cid;
        const result = await cartModel.findById(idCart);
        return res.status(200).send({
            status: "success",
            result
        });
    }catch (error) {
        res.status(400).send({
            status: "Error",
            msg: `El carrito solicitado no se puede visualizar.`
        });
    };
});
router.get('/:cid/detail', async (req, res) => {
    try {
        const idCart = req.params.cid;
        const result = await cartManagerMongo.getDetailsInCart(idCart);
        return res.status(200).send({
            status: "success",
            result
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Error al obtener los detalles del carrito.' });
    };
});
router.post('/', async (req, res) => {
    try{
        const result = await cartModel.create({ products: [] });
        await managerAccess.createRecord('CART CREATED');
        res.status(200).send({
            status: "success",
            result
        });
    }catch (error) {
        res.status(400).send({
            status: "Error",
            msg: `El carrito solicitado no se puede crear.`
        });
    };
});
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const idCart = req.params.cid;
        const idProduct = req.params.pid;
        const result = await cartManagerMongo.addProductInCart(idCart, idProduct);
        return res.status(200).send({
            status: "success",
            result
        });
    } catch (error) {
        res.status(400).send({
            status: "Error",
            msg: `El producto solicitado no se puede agregar en el carrito indicado.`
        });
    };
});
router.delete('/:cid', async (req, res) => {
    try {
        const idCart = req.params.cid;
        await cartManagerMongo.clearCart(idCart);
        res.status(200).send({
            status: "Success",
            msg: "Carrito vaciado exitosamente"
        });
    } catch (error) {
        res.status(400).send({
            status: "Error",
            msg: "No se puede vaciar el carrito"
        });
    };
});
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const idCart = req.params.cid;
        const idProduct = req.params.pid;
        const quantity = req.body.quantity;
        await cartManagerMongo.updateProductQuantity(idCart, idProduct, quantity);
        res.status(200).send({
            status: "success",
            msg: "Cantidad del producto actualizada exitosamente"
        });
    } catch (error) {
        res.status(400).send({
            status: "Error",
            msg: "No se puede actualizar la cantidad del producto en el carrito"
        });
    };
});
router.put('/:cid', async (req, res) => {
    try {
        const idCart = req.params.cid;
        const products = req.body;
        await cartManagerMongo.addProductsToCart(idCart, products);
        res.status(200).send({
            status: 'success',
            message: 'Productos agregados al carrito exitosamente',
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: 'No se pudieron agregar los productos al carrito',
        });
    }
});
export default router;