import express from 'express';
import {verifyToken} from '../middleware/auth.js'
import db from '../connections/db.js';
const router =  express.Router();

//store item in a cart
router.post('/addToCart',verifyToken,async (req,res)=>{
    console.log(req.body);
    const {productId,uuid,productName,productAmount,shopId,productImagePath,quantity} = req.body;
    try {
        await db.query('INSERT INTO cart set ?',{productId : productId ,productName:productName, shopId: shopId, productAmount: productAmount,uuid : uuid, ImagePath : productImagePath, quantity :quantity},async(err,result)=>{
            if(err){
                if(err.code === 'ER_DUP_ENTRY'){
                    res.status(409).json({error:'Already in the cart'})
                }
                else console.log(err);
            }
            else{
                await db.query('select * from cart where uuid = ?',[uuid],async(err,result2)=>{
                    const cartList = result2
                    res.status(201).json({cartList,msg:"Added to cart"})
                })

            }
        });
    } catch (error) {
        res.status(500).json({error:error.message});
    }
 
});

//get cart details
router.get('/getCartDetails/:id',verifyToken,async (req,res)=>{
    var uuid =  req.params.id;
    try {
        await db.query('select * from cart where uuid = ?',uuid,(err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                res.status(200).send(result);
            }
        })
        
    } catch (error) {
        res.status(500).json({error:error.message});
    }
    
});

router.post('/deleteFromCart', async(req,res) =>{
    const { productId} = req.body;
    try{
        await db.query('delete from cart where productId = ?',productId,(err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                res.status(200).json({msg:"successfully removed from the cart"})
            }
        })
    }
    catch(err){
        res.status(500).json({error : err.message});
    }
})

router.put('/updateCart',async(req,res) => {
    const { productId,quantity } = req.body;
    console.log(req.body);
    try{
        await db.query('update cart set quantity = ? where productId = ?',[quantity,productId],(err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                const updatedQuantity = quantity;
                res.status(200).json({quantity: updatedQuantity,msg:"successfully updated cart"})
            }
        })
    }
    catch(err){
        res.status(500).json({error : err.message});
    }
})
export default router;
//module.exports = router;