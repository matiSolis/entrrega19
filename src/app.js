import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import __dirname from "./utils.js";
import cartRouter from "./routes/cart.router.js";
import chatRouter from "./routes/chat.router.js";
import productRouter from "./routes/product.router.js";
import sessionRouter from "./routes/session.router.js";
import viewsRouter  from "./routes/views.router.js";
import messagesModel from "./Dao/models/message.model.js";


const PORT = process.env.PORT || 8080;
const app = express();
const MONGO = 'mongodb+srv://solismatiasn:sarasacoco@cluster0.2g9gvye.mongodb.net/ecommerce?retryWrites=true&w=majority';
const conection = mongoose.connect(MONGO);
const server = app.listen(PORT, ()=>{
    console.log('Servidor funcionando en el puerto: '+PORT);
});
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));
// app.use('/realTimeProducts',viewsRouter);
app.use(session({
    store: new MongoStore({
        mongoUrl: MONGO,
        ttl:4000
    }),
    secret: 'CoderSecret',
    resave: false,
    saveUninitialized: false
}));
app.use('/',viewsRouter);
app.use('/api/chat', chatRouter);
app.use('/api/products/', productRouter);
app.use('/api/carts/', cartRouter);
app.use('/api/session', sessionRouter);

const io = new Server(server);
const newMessage = new messagesModel();

// io.on('connection', async Socket => {
//     console.log('socket connected');
//     const products = await productManager.getProducts();
//     io.emit('productList', products);
//     Socket.on('productAdd', async newProd=> {
//         let newProduct = await productManager.addProduct(newProd);
//         const products = await productManager.getProducts();
//         io.emit('productList', products);
//     });
//     Socket.on('productDeleted', async delProd =>{
//         let pid = await productManager.deleteProduct(delProd);
//         const products = await productManager.getProducts();
//         io.emit('productList', products);
//     });
//     Socket.on('messageHome', data => {
//         io.emit('log', data);
//     });
//     Socket.on('message', async data=>{
//         const newMessage = new messagesModel({
//             user: data.user,
//             message: data.message
//         });
//         await newMessage.save();
//         const messages = await messagesModel.find();
//         io.emit('messageLogs', messages);
//     });
//     Socket.on('authenticated', (data) =>{      
//         Socket.broadcast.emit('newUserConnected', data);
//     });
// });