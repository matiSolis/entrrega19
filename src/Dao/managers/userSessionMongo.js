import userModel from "../models/user.model.js"
import ManagerAcces from "./managerAccess.js"

const managerAccess = new ManagerAcces();

export default class UserSessionMongo {
    async addUser(userData){
        const {firstName, lastName, email, password} = userData;
        if (!firstName || !lastName || !email || !password) {
            throw new Error("Faltan datos");
        };
        const user = {firstName, lastName, email, password};
        const result = await userModel.createUser(user);
        await managerAccess.createRecord('USER CREATED');
        return result;
    }
}