const Review = require("../models/reviewModel");
// const factory = require("./factoryHandler")

exports.getAllReview = async (req, res, next) => {
    try{
    const review = await Review.find();

    res.status(200).json({
        status:"success",
        review
    })
}
catch(err){
    res.status(500).json({
        status: "fail",
        message: "Unable to get all reviews"
    })
}
}

exports.getReview = async (req, res, next) => {
    try{    
    const filter = {};
    if(!req.user.tourId) filter = { tour: req.params.tourId }

    const review = await Review.findById(filter);

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


exports.createReview = async (req, res, next) => {
    try{
        if(!req.body.user) req.body.user = req.user.id;
        if(!req.body.tour) req.body.tour = req.params.tourId;

        const review = await Review.create(req.body);
  
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


// exports.deleteReview = factory.deleteDoc(Review);