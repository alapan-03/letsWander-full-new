const Booked = require("../models/bookedModel");

exports.getAllBooked = async (req, res, next) => {
    try{
    const booked = await Booked.find();

    res.status(200).json({
        status:"success",
        booked
    })
}
catch(err){
    res.status(500).json({
        status: "fail",
        message: "Unable to get all reviews"
    })
}
}


// exports.getCurrUserBooked = async (req, res, next) => {
//     try{
//         const booked = await Booked.findById(req.user.id);

//         res.status(200).json({
//             status: "success",
//             booked
//         })
//     }
//     catch(err){
//         res.status(500).json({
//             status: "fail",
//             message: "err"
//         })
//     }
// }


exports.createBooked = async (req, res, next) => {
    try{
        if(!req.body.user) req.body.user = req.user.id;
        if(!req.body.tour) req.body.tour = req.params.tourId;

        const review = await Booked.create(req.body);
  
    res.status(200).json({
        status:"success",
        review
    })
    }
    catch(err){
        res.status(500).json({
            status: "fail",
            message: "Unable to get review"
        })
    }   
}
