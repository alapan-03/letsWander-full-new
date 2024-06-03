const mongoose = require("mongoose");
const fs = require("fs");


const tourSchema = mongoose.Schema({
    name:{
        type: String,
        // required: [true, "A name is required"]
        unique: true,
    },
    ratingsQuantity: Number,
    ratings: Number,
    price: {
        type: Number,
        // required: [true, "price is required"],
    },
    duration: {
        type: Number,
        // required: [true, "Duration is required"]
    },
    theme: {
        type : String
    },
    domestic: {
        type: Boolean,
    },
    places:{
        type: [String]
    },
    placeDuration:{
        type: [Number],
    },
    bestSelling: {
        type: Boolean
    },
    image: {
        type: String
    },
    images: {
        type: [String]
    },
    overview: {
        type: String
    },
    inclusions: {
        type: [String]
    },
    exclusions: {
        type: [String]
    },
    itinerary: {
        type: [String]
    },
    admin: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    guides:{ 
        type: [mongoose.Schema.ObjectId],
        ref: "User"
    },
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
}
)


tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
  });
  

const Tour =  mongoose.model("Tour", tourSchema);

// const newTour = new Tour({
    //     name:"New Zealand",
    //     price: 499,
    //     duration: 6
    // })
    
    // newTour.save().then(doc=>{
        // }).catch(err=>{
            //     console.log(err);
            // })
    // const readFile = fs.readFileSync("./data.json", "utf-8", (err, data)=>{
    //     if(err){
    //         console.log(err);
    //         return;
    //     }

    //     Tour.create(data);

    // })

module.exports = Tour