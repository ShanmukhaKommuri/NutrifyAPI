const cors = require('cors');
const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

mongoose.connect("mongodb://127.0.0.1:27017/nutrifyApp")
.then(()=>{
    console.log("connected successfully");
})
.catch((err)=>{
    console.log("error in connection");
})

const userModel = require("./models/userModel.js");
const foodModel = require("./models/foodModel.js");
const trackingModel = require("./models/trackingModel.js");
const verifyToken = require("./verifyToken.js");

const app = express();
// middleware

app.use(express.json());
app.use(cors());



//  register endpoint
app.post("/register", (req,res)=>{
    let user = req.body;
    // userModel.create(user)
    // .then((doc)=>{
    //     res.status(201).send({message:"user Registered"});
    // })
    // .catch((err)=>{
    //     console.log(err);
    //     res.status(400).send({message:"error in registering"});
    // })
    bcrypt.genSalt(10,(err, salt) =>{
        if(!err){
            bcrypt.hash(user.password, salt ,async (err ,hpass)=>{
                if(!err){
                    user.password = hpass
                    try{
                        let doc = await userModel.create(user);
                        res.status(201).send({message:"user Registered"});
                    }
                    catch(err){
                        console.log(err);
                        res.status(400).send({message:"error in registering"});
                    }
                }
            });
            
        }
    })

})

// endpoint for login

app.post("/login",async (req,res)=>{
    let userCred = req.body;
    try{
        const user = await userModel.findOne({
            email:userCred.email
        });
        if(!user){
             console.log("user notFound");
             console.log("user notFound");
             res.status(404).send({message : "user not found"})
        }
        else{
            bcrypt.compare(userCred.password,user.password,(err,success)=>{
                if(success==true){
                    jwt.sign({email:userCred.email},"nutrifyAppAsKey",(err,token)=>{
                        if(!err){
                            res.send({ userId : [user._id],name :[user.name], message:"login success",token : token})
                        }
                    })
                }
                else{
                    res.status(403).send({message:"incorrect password"});
                }
            })
        }
        

    }
    catch(err){
        console.log(err);
    }

})

// fetch all foods
app.get("/foods" ,verifyToken,async (req , res) => {
    try{
        let foods = await foodModel.find();
        console.log(foods);
        res.status(200).send(foods)
    }
    catch(err){
        console.log(err);
        res.status(500).send({message:"error in fetching food"});
    }
});

// endpoint to fetch a food by name

app.get("/foods/:name",verifyToken,async (req,res) =>{
    try{

        let foods = await foodModel.find({name:{$regex : req.params.name,$options :  'i'}});
        if(foods.length !== 0){
            res.send(foods);
        }else{
            res.send({message : "food not found"});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send({message:"some problem in getting the food"})
    }
})

//endpoint to track food

app.post("/track",verifyToken , async(req, res) =>{
    let food = req.body;
    try{
        let data = await foodModel.create(food);
        console.log("food added");
        res.send({message  : "food added successfully"});
    }
    catch(err){
        console.log(err);
        res.send({message:"something went wrong while adding"});
    }
})


//  endpoint for fetching all foods eaten by a person

app.get("/track/:userId/:date" , verifyToken , async (req , res) =>{


    let userid = req.params.userId;
    let date = new Date(req.params.date);
    let strDate = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
    try{
        foods = await trackingModel.find({userId:userid,eatenDate:strDate}).populate(userId).populate(foodId);
        console.log(foods);
        res.send(foods);
    }
    catch(err){
        console.log(err);
        res.send({message:"error in fetching user details"});
    }
})


app.listen(8000,()=>{
    console.log("server is now running");
})
