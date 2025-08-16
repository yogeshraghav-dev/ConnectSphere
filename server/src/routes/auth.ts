import { Router } from "express";
import {Role } from "../models/Role";
import {User } from "../models/User";
import bcrypt from "bcryptjs";

const router = Router();

router.post("/login", async (req, res) => {
if (!req.body) {
    return res.status(400).json({status:false, message: "Email and password are required" });
}

if(!req.body.email){
    return res.status(400).json({status:false, message: "Email is required" });
}


if(!req.body.password){
    return res.status(400).json({status:false, message: "Password is required" });
}
const { email, password } = req.body;

  try {
    const user= await User.findOne({ email}).populate("roleId");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user?.passwordHash!);
    if (!isMatch) {
         return res.status(401).json({ message: "Invalid email or password" });
    }

    const IsAdmin=user?.roleId?.name;
    if(IsAdmin!="SUPER_ADMIN"){
       return res.status(403).json({status:false,message:"Access denied. Only SUPER_ADMIN can login."});
    }
    res.json({
      status: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user?.roleId?.name, 
      },
    });
  }catch(error) {
    return res.status(500).json({ message: error instanceof Error ? error.message : "Internal server error" } );
  }
})

export default router;