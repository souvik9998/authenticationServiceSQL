import express from 'express';
import db from '../connections/db.js';
import { verifyToken } from '../middleware/auth.js';
import {v4 as uuidv4} from 'uuid';

const router = express.Router();

router.post('/addAddress', async(req,res) =>{
    console.log(req.body)
    const {fullName,userId,addressLine1,addressLine2,city,state,postalCode,country,mobileNumber,isDefault} = req.body;
    try{
        const newAddress = {
            id: uuidv4(),
            full_name: fullName,
            user_id: userId,
            address_line1: addressLine1,
            address_line2: addressLine2,
            city: city,
            state: state,
            country: country,
            postal_code: postalCode,
            mobile_number: mobileNumber,
            is_default : isDefault
        };
        await db.query('insert into user_address set ?',newAddress, (err,result) => {
            if(err){
                console.log(err);
            }
            else{
                res.status(201).json({msg:'successfully added address',address : newAddress})
            }
        });
    }
    catch(err){
        res.status(500).json({err : err.message});
    }
})

router.get('/getUserAddress/:id', async(req,res) =>{
    const userId = req.params.id;
    try{
        await db.query('select * from user_address where user_id = ?',[userId],(err,results)=>{
            if(err){
                console.log(err);
            }
            else{
                res.status(200).send(results);
            }
        })
    }
    catch(err){
        res.status(500).json({err:err.message});
    }
})

router.put('/setDefaultAddress/:id' ,async(req,res) =>{

    const addressId = req.params.id;
    const {isDefault} = req.body;
    console.log(isDefault);
    try{
        await db.query('update user_address set is_default = ? where id = ?',[isDefault,addressId]);
        await db.query('update user_address set is_default = ? where id != ?',[false,addressId]);

        res.status(200).json({msg:"default address set successfully"});
    }
    catch(errr){
        res.status(500).json({msg:"internal server error"});
    }
})

router.delete('/deleteUserAddress/:addressId', async(req, res) => {
    const { addressId } = req.params;
    // console.log(addressId);
    let defaultAddressId;
    try {
        await db.query('SELECT is_default FROM user_address WHERE id = ?', [addressId],async(err,res)=>{
        if(err){
            console.log(err);
        }
        const isDefault = res[0];
        const isDefaultResult = isDefault.is_default;
        if(isDefault && isDefaultResult){
            await db.query('delete from user_address where id = ?',[addressId],async(err,res)=>{
                await db.query('update user_address set is_default = ? order by id asc limit 1',[true],async(err,res)=>{
                    await db.query('select id from user_address where is_default = ?',[true],async(err,result)=>{
                        if(result.length > 0){
                            defaultAddressId = result[0].id;
                            console.log(defaultAddressId);
                        }
                    }) 
                })
            });   
        }
        else{
            await db.query('delete from user_address where id = ?',[addressId]);
        } 
    });
        setTimeout(()=>{
            res.status(200).json({ msg: 'successfully deleted' ,defaultAddressId:defaultAddressId});
        },2000)
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
});
export default router;