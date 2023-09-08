import jwt from 'jsonwebtoken';
import db from "../connections/db.js";
export const verifyToken = async(req,res,next) =>{
    try{
        let token = req.header("Authorization");
        if(!token){
            return res.status(403).json({msg:"access denied"});
        }
        if(token.startsWith("Bearer ")){
            token = token.slice(7,token.length).trimLeft();
        }

        const verified = jwt.verify(token,process.env.JWT_SECRET);
        
        req.user = verified;
        next();
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
