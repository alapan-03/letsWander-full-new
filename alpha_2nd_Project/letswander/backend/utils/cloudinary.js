// import {v2 as cloudinary} from "cloudinary"
// import fs from "fs"

require("dotenv").config()

const cloudinary = require("cloudinary").v2
const fs = require("fs")



cloudinary.config({ 
  cloud_name: "du5kgs8r3", 
  api_key: "882913868936278", 
  api_secret: "_hZVghiYeRiaN5nFMqjb2eEA738" 
});

exports.uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}



// export {uploadOnCloudinary}