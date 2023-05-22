import { Router } from "express";
import userModel from "../Dao/models/user.model.js";
import UserSessionMongo from "../Dao/managers/userSessionMongo.js";
import ManagerAcces from "../Dao/managers/managerAccess.js";

const router = Router();
const userSessionMongo = new UserSessionMongo();
const managerAccess = new ManagerAcces();

router.post('/register', async (req, res) => {
    try {
        const userData = req.body;
        const exist = await userModel.findOne({email});
        if(exist){
            return res.status(400).send({status:"error", error:"User already exists."});
        };
        await userSessionMongo.addUser(userData);
        res.status(200).send({status:"succes", message:"User registered."});
    }catch (err) {
        res.status(500).send({ error: 'Error interno del servidor.'});
    };
});
router.post('/login', async (req, res) => {
    try{
        const admin = {name:"admin", email:"adminCoder@coder.com", password:"adminCod3r123"};
        const {email, password} = req.body;
        if(email === admin.email && password === admin.password){
            await managerAccess.createRecord('ADMIN LOGIN'); 
            req.session.admin={
                name: admin.name,
                email: admin.email
            };
            res.status(200).send({status:"succes", payload:req.res.admin, message:"Logueo exitoso como administrador."});
        }else{
            const userData = await userModel.findOne({email, password});
            if(!userData){ return res.status(404).send({status:"error", error:"Datos incorrectos."});}
            req.session.user={
                name: `${userData.firstName} ${userData.lastName}`,
                email: userData.email
            };
            await managerAccess.createRecord('USER LOGIN', userData); 
            res.status(200).send({status:"succes", payload:req.res.userData, message:"Logueo de usuario exitoso."});
        }
    }catch (err){
        res.status(500).send({ error: 'Error interno del servidor.'});
    };
});
router.get('/logout', (req,res) =>{
    req.session.destroy(error =>{
        if(error) return req.status(500).send({status:"error", error:"Error al cerrar la sesión."});
        res.redirect('/login');
    });
});

export default router;