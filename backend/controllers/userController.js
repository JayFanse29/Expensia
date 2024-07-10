const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// EXAMPLE

// exports.getAllUsers = async (req, res) => {
//     try {
//         const users = await User.find();
//         res.json(users);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

exports.createUser = async (req,res) => {
    try{
        const userData = req.body;
        
        const newUser = new User({
            'fname': userData.fname,
            'lname': userData.lname,
            'email': userData.email,
            'password': await bcrypt.hash(userData.password,10)
        })

        const savedUser = await newUser.save();
        res.json({
            user : savedUser,
            message : "User Created Successfully!",
            executed: true,
            token: jwt.sign({userId : savedUser._id},process.env.SECRET_KEY)
        })
    }
    catch(err){
        console.log(err);
        res.json({
            executed: false,
            message: "Email already exists!"
        })
    }
};

exports.loginUser = async (req,res) => {
    try{
        const loginData = req.body;
        

        const user = await User.findOne({email: loginData.email});

        if(!user)
        {
            res.json({
                execute: true,
                exists: false,
                message: "Email address or password does not match!"
            })
        }
        else
        {
            const isMatch = await bcrypt.compare(loginData.password,user.password);
            if(isMatch)
            {
                res.json({
                    executed: true,
                    exists: true,
                    user: user,
                    token: jwt.sign({userId : user._id},process.env.SECRET_KEY)
                })
            }
            else
            {
                res.json({
                    executed: true,
                    exists: false,
                    message: "Invalid password"
                })
            }
        }

    }
    catch(err)
    {
        console.log(err);
    }
}

exports.getUser = async (req,res) => {
    try{
        const userId = req.tokenData.userId;
        console.log(userId);
        const user = await User.findById(userId);

        if(user)
        {
            res.json({
                exists: true,
                user: user
            })
        }
        else
        {
            res.json({
                exists: false
            })
        }

    }catch(err)
    {
        console.log(err);
    }
};

exports.getName = async (req,res) => {
    try{
        const userId = req.query.userId;

        const user = await User.findById(userId);

        res.json({
            name: user.fname+" "+user.lname
        })
    }
    catch(err)
    {
        console.log(err);
    }
}