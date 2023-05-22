import { Router } from "express";
import ProductManagerMongo from "../Dao/managers/productManagerMongo.js";
import productModel from "../Dao/models/products.model.js";
import ManagerAcces from "../Dao/managers/managerAccess.js";

const router = Router();
const productManagerMongo = new ProductManagerMongo();
const managerAccess = new ManagerAcces();

router.get('/', async (req, res) => {
    try {
    const products = await productModel.find();
    await managerAccess.createRecord('GET PRODUCTS');
    res.status(200).send({ products });
    } catch (error) {
        res.status(500).send({ error: 'Error interno del servidor' });
    };
});
router.get('/:pid', async (req, res) => {
    try {
    const idProduct = req.params.pid;
    const product = await productModel.find({ _id: idProduct });
    await managerAccess.createRecord('GET PRODUCT BY ID');
    res.status(200).send({ product });
    } catch (error) {
        res.status(500).send({ error: 'Error interno del servidor' });
    };
});
router.post('/', async (req, res) => {
    try {
    const productData = req.body;
    await productManagerMongo.addProduct(productData);
    res.status(200).send({ msg: 'Producto creado exitosamente' });
    } catch (error) {
        res.status(500).send({ error: 'Error interno del servidor' });
    };
});
router.delete('/:pid', async (req, res) => {
    try {
    const idProduct = req.params.pid;
    await productModel.deleteOne({ _id: idProduct });
    await managerAccess.createRecord('PRODUCT DELETED');
    res.status(200).send({ msg: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).send({ error: 'Error interno del servidor' });
    };
});
router.put('/:pid', async (req, res) => {
    try {
    const idProduct = req.params.pid;
    const updateData = req.body;
    await productModel.updateOne({ _id: idProduct }, { $set: updateData });
    await managerAccess.createRecord('UPDATE PRODUCT');
    res.status(200).send({ msg: 'Producto actualizado exitosamente' });
    } catch (error) {
        res.status(500).send({ error: 'Error interno del servidor' });
    };
});
export default router;  