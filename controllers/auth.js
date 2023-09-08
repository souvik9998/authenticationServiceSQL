import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../connections/db.js";
import {v4 as uuidv4} from 'uuid';

export const register = async(req,res) =>{
    console.log(req.body)
    try{
        const {name,email,mobileNumber,password,confirmPassword} = req.body;
        db.query('select email from user where email = ?',[email], (error,results) =>{
            if(error){
                console.log(error);
            }
            if(results.length > 0){
                return res.status(400).json({msg:"email already in use"})
            }
        });
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        db.query('insert into user set ?', {user_id: uuidv4(), user_name:name, email:email, mobile_number:mobileNumber, password:passwordHash},(error,results)=>{
            if(error){
                console.log(error)
            }
            else{
                return res.status(201).json({msg:"successfully registered"})
            }
        })
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
}

export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      db.query('select email from user where email = ?',[email], (error,results) =>{
        if(error){
            console.log(error);
        }
        if(results.length = 0){
            return res.status(400).json({msg:"you havn't registered yet"})
        }
        });
        db.query('select * from user where email = ?',[email],(error,rows,fields) =>{
            if(error){
                console.log(error);
            }
            var password_hash=rows[0]['password'];
            const isMatch = bcrypt.compare(password,password_hash);
            if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
            const token = jwt.sign({ name: rows[0].user_id }, process.env.JWT_SECRET);
            res.status(200).json({
                msg:"login successfull",
                token,
                user: rows[0]
            });
        });
        
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
export const isAuthorized = async(req,res) =>{
    try{
        const userId = req.user.name;
        let user;
        console.log(userId);
        await db.query('SELECT * FROM user WHERE user_id = ?', [userId],(err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                user = result[0]
                res.status(200).json({user,msg:"authorized"});
            }
        })
    }
    
    catch(err){
        res.status(500).json({msg:err.message})
    }
}

export const updateUser = async(req,res) =>{
    try{
        const userId = req.params.userId;
        const updates = req.body;

        const updateValue = Object.values(updates);

        await db.query(`update user set ${Object.keys(updates)} = ? where user_id = ?`,[updateValue,userId],async(err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                res.status(200).json({msg:'successfully updated'})
            }
        })
    }
    catch(err){
        res.status(500).json({msg:err.message});
    }
}