const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const detailsSchema = mongoose.Schema({
    // userId: Schema.Types.ObjectId,
    title: {
        type: String,
        // unique: true
    },
    price: Number,
    totalAdults: Number,
    // totalPrice: Number,
    totalChild: Number,
    duration: Number,
    startDate: Date,
    endDate: Number,  
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    tour: {
        type: Schema.Types.ObjectId,
        ref: "Tour"
    }
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

detailsSchema.virtual('totalPrice').get(function() {
  return (this.price * this.totalAdults) + (this.price * (this.totalChild / 2));
});



detailsSchema.pre(/^find/, function(next){
    this.populate({
        path: "tour",
    }).populate({
        path: "user"
    })

    next();
})



detailsSchema.statics.findByUserId = function (userId, tourId) {
    return this.findOne({ user: userId, tour: tourId });
  };


const Cart = mongoose.model("Details", detailsSchema);

module.exports = Cart;