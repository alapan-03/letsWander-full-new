const mongoose = require("mongoose");

const bookedSchema = mongoose.Schema({

    tour:{
        type: mongoose.Schema.ObjectId,
        ref: "Tour"
    },

    user:{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }, 
})


// bookedSchema.pre(/^find/, function(next){
//     this.populate({
//         path: "tour",
//         select: "name"
//     }).populate({
//         path: "user",
//         select: "name photo"
//     })

//     next()
// })


const bookedTour = mongoose.model("Booked", bookedSchema);

module.exports = bookedTour;