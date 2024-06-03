const Cart = require("../models/detailsModel");

exports.addDetails = async (req, res, next) => {
try{
    const details = await Cart.create(req.body);

    // console.log(req.user?._id)

    details.user = req.user;
    details.tour = req.params.tourId;

    await details.save();

    res.status(201).json({
        status: "success",
        body:details
    })
}
catch(err){
    res.status(400).json({
        status: "fail",
        message: err
    })}

}

exports.getDetail = async (req, res, next) => {
    try{
        console.log(req.userDetail)
        const detail = await Cart.findById(req.user);
        
        res.status(200).json({
            status: "success",
            detail,
            details: req.userDetail
        })
    }
    catch(err){
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
}


exports.getAllDetail = async (req, res, next) => {
    try{
        const doc = await Cart.findByUserId(req.user, req.params.tourId);
        //  console.log(doc);

        // doc.user = req.user.id;
        // doc.tour = req.params.tourId;

        // await doc.save()

         res.status(200).json({
            status:"success",
            doc
         })
    }
    catch(err){
        res.status(400).json({
            status: "fail",
            message: err.message
        })
    }
}