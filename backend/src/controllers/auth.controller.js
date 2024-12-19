import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

import { generateToken } from "../lib/utils.js";

const signUp = async (req,res) => {
    const {email, fullName, password} = req.body;
    try {
        if (!email || !password || !fullName){
            return res.status(400).json({message: "All fields are required."});
        }

        if (password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters long."});
        }

        const existingUser = await User.findOne({email});
        if (existingUser){
            return res.status(400).json({message: "Email already exists."});
        }


        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            fullName,
            password: hashedPassword
        });

        if (!newUser){
            return res.status(400).json({message: "Invalid user data."});
        }

        //generate JWT token
        const token = generateToken(newUser._id, res);
        await newUser.save();
        return res.status(201).json({
            id: newUser._id,
            email: newUser.email,
            fullName: newUser.fullName,
            profilePic: newUser.profilePic,
            createdAt: newUser.createdAt
        });
    } catch (error) {
        console.log("Error in signUp controller", error.message);
        return res.status(500).json({message: "Internal Server Error"});   
    }

};

const logIn = async (req,res) => {
    const {email, password} = req.body;
    try {
        const existingUser = await User.findOne({email});
        if (!existingUser){
            return res.status(400).json({message: "Invalid credentials."});
        }

        const isValidPassword = await bcrypt.compare(password, existingUser.password)
        if (!isValidPassword) {
            return res.status(400).json({message: "Invalid credentials."});
        }

        const token = generateToken(existingUser._id, res);

        return res.status(200).json({
            id: existingUser._id,
            email: existingUser.email,
            fullName: existingUser.fullName,
            profilePic: existingUser.profilePic,
            createdAt: existingUser.createdAt
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        return res.status(500).json({message: "Internal Server Error"});   
    }
};

const logOut = async (req,res) => {
    try {
        res.cookie("jwt","",{
            maxAge: 0
        });
        return res.status(200).json({message: "Logged out successfully."});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        return res.status(500).json({message: "Internal Server Error"});   

    }
};

const updateProfile = async (req,res) => {
    const {profilePic} = req.body;
    try {
        const userId = req.user.id;
        if (!profilePic) {
            return res.status(400).json({message: "Profile picture is required."});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {
            new: true //return after update
        });

        return res.status(200).json({
            id: updatedUser._id,
            email: updatedUser.email,
            fullName: updatedUser.fullName,
            profilePic: updatedUser.profilePic,
            createdAt: updatedUser.createdAt
        });
    } catch (error) {
        console.log("Error in update profile controller", error.message);
        return res.status(500).json({message: "Internal Server Error"});   

    }
};

const checkAuth = async (req,res) => {
    try {
        console.log(req.user);
        return res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in check auth controller", error.message);
        return res.status(500).json({message: "Internal Server Error"});   

    }
};


export {signUp, logIn, logOut, updateProfile, checkAuth}