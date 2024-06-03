const GlUser = require("../models/userGglModel");

exports.signup = async (req, res, next) => {
    try{
        const newUser = await GlUser.create(req.body);
    
         res.status(201).json({
            status: "success",
            // token
            message: "Signed up with google"
         })
    
    } catch(err){
        res.status(500).json({
            status: "fail",
            // message: "Error while creating an user"
            message: err
        })
    }
    }


    exports.login = async (req, res, next) => {
        try{
            const newUser = await GlUser.findOne({email: req.body.email});
        
             res.status(201).json({
                status: "success",
                // token
                newUser
             })
        
        } catch(err){
            res.status(500).json({
                status: "fail",
                // message: "Error while creating an user"
                message: err
            })
        }
        }