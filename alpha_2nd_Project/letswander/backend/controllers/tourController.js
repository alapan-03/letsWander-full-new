const Tour = require("../models/tourModel");
const fs = require("fs");
const factory = require("./factoryHandler")
const redis = require("redis");

const client = require('../redisMiddleware/redisMiddle')

// client.on("error", (err) => {
//     console.error("Redis error: ", err);
// });

exports.getAllTours = async (req, res) => {
    try{
        // await client.connect().catch(console.error);
        if(req.query.name ){
            let data = await Tour.find({name:req.query.name});

            // await client.set("data", JSON.stringify(data), { EX: 3600 });

            console.log(data)

            res.status(200).json({
                data
            })
        }
        else{
            let data = await Tour.find();

            // await client.set("data", JSON.stringify(data), { EX: 3600 });
            res.status(200).json({
                data
            })
        }
    }
    catch(err){
        console.log(err);
    }
}

// exports.cachedTours = async(req, res, next) => {
//     try{
//         const data = await client.get("data");
//         // console.log(data)

//         if (data) {
//             // If data exists in cache, return it
//             return res.status(200).json({
//                 status: "success",
//                 data: JSON.parse(data)
//             });
//         }

//         // If no data in cache, proceed to the next middleware/controller
//         next();
//     }
//     catch(err){
//         res.status(500).json({
//             status: "fail",
//             message: err.message+"nnn"
//         })
//     }
// }


exports.getById = async (req, res) => {
try{
    const getById = await Tour.findById(req.params.id).populate("admin").populate("guides");
    let popu = await getById.populate("reviews")
    // console.log(popu)

    res.status(200).json({
        status: "success",
        message: getById
    })
}
catch(err){
    console.log(err)
}
}

exports.createTour = factory.createDoc(Tour);

exports.deleteById = factory.deleteDoc(Tour);

exports.editById = factory.updateDoc(Tour);



// const readFile = JSON.parse(fs.readFileSync("./data.json", "utf-8"))

// console.log(readFile)
const addAll = async () => {
try{
    await Tour.create(readFile);
    console.log("Data successfully loaded!")
}
catch(err){
    console.log(err);
}

}

const deleteAll = async () => {
try{
     await Tour.deleteMany();

     res.status(200).json({
        status:"success",
        message: "All data deleted"
     })
    }
catch(err){
        console.log(err);
    }
}

// addAll();
// deleteAll();
