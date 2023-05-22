import { Router } from "express";
import messagesModel from "../Dao/models/message.model.js";
import ManagerAccess from "../Dao/managers/managerAccess.js";

const router = Router();
const managerAccess = new ManagerAccess();

router.get('/', async (req, res) => {
    try {
        await managerAccess.createRecord('GET MESSAGES');
        const messages = await messagesModel.find();
        res.status(200).render('chat', {messages});
    }catch (err) {
        res.status(400).send({
            status: "Error",
            msg: `Los mensajes no se pueden visualizar.`
        });
    }
});
export default router;