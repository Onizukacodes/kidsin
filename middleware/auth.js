const User=require('../models/User')
const jwt=require('jsonwebtoken')

const auth=async(req,res,next)=>{
        try {
            const token=req.header("Authorization")
            if(!token) return res.status(400).json({msg:"Please Login"})
            const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
            if(!decoded) return res.status(400).json({msg:"Please Login"})

            const user=await User.findOne({_id:decoded.id})
            req.user=user
            next()

        } catch (error) {
                return res.status(500).json({msg:error.message})
        }
}
 
module.exports=auth 