import { Router } from "express";
import ViewsManagerMongo from "../Dao/managers/viewsManagerMongo.js";

const router = Router();
const publicAcces = (req,res,next) =>{
    if(req.session.user) return res.redirect('/profile');
    next();
}

const privateAcces = (req,res,next)=>{
    if(!req.session.user) return res.redirect('/login');
    next();
}

router.get('/', async (req, res) => {
        await ViewsManagerMongo.homeRender(req, res);
    });
router.get('/carts/:cid', async (req, res) => {
        await ViewsManagerMongo.cartRender(req, res);
    });
router.get('/product/:pid', async (req, res) => {
        await ViewsManagerMongo.productRender(req, res);
    });
router.get('/products', async (req, res) => {
        await ViewsManagerMongo.productsRender(req, res);
    });
router.get('/register', publicAcces, (req,res)=>{
        res.render('register');
    });
router.get('/login', publicAcces, (req,res)=>{
        res.render('login');
    });
router.get('/profile', privateAcces ,(req,res)=>{
        res.render('profile',{
            user: req.session.user
        });
    });


export default router;

