import express from 'express';
import {verifyToken} from '../middleware/auth.js'
import db from '../connections/db.js';
const router =  express.Router();

router.get('/getOrderDetails/:userId', async(req, res) => {
    try {
        const userId = req.params.userId;
        const orderItems = [];

        db.query('SELECT id FROM order_details WHERE user_id = ?', [userId], async (err, result) => {
            if (result && result.length > 0) {
                const orderPromises = result.map((order) => {
                    return new Promise((resolve, reject) => {
                        db.query('SELECT * FROM order_items WHERE order_id = ?', [order.id], (err, items) => {
                            if (err) {
                                reject(err);
                            } else {
                                orderItems.push(...items);
                                resolve(); 
                            }
                        });
                    });
                });

                Promise.all(orderPromises)
                    .then(() => {
                        res.status(200).json({ orderItems: orderItems });
                    })
                    .catch((error) => {
                        res.status(500).json({ error: error.message });
                    });
            } else {
                res.status(200).json({ msg: 'no order found' });
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/getParticularOrderDetails/:orderId',async(err,res)=>{
    try{
        
    }
    catch(err){
        res.status(500).json({err:err.message});
    }
})

export default router;