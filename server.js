import express from "express";
import cors from  "cors";
import bodyParser from "body-parser";
import mysql from "mysql";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import db from "./connections/db.js";
import cartRouter from "./routes/cartService.js";
import addressRouter from './routes/userAddress.js';
import OrderRouter from './routes/OrderService.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000' }));



db.connect((err) =>{
    if(err){
        console.log(err.message);
        return;
    }
    console.log("database connected");
}); 

app.use("/auth",authRoutes);
app.use("/cart",cartRouter);
app.use("/order",OrderRouter);
app.use(addressRouter);

app.get('/working', (req,res)=>{
    console.log('working');
    res.send('api is working');
})


app.listen(9000, ()=>{
    console.log(`server connected on port 9000`);
})