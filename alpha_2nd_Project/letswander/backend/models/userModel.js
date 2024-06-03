// const { default: userEvent } = require("@testing-library/user-event");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        // unique: true,
        trim: true,
        required: [true, "A name is required while signing up"],
    },

    photo: {
        type: String,
        default: ""
    },

    email: {
        type: String,
        validate: [validator.isEmail, "Please provide a valid email"],
        required: [true, "An email is required while signing up"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "A password is required while signing up"]
    },
    confirm_password: {
        type: String,
        validate: {
            validator: function (el){
                return el === this.password;
            },
            message: "Passwords are not same"
        },
        required: [true, "Password confirmation is required while signing up"]
    },
    passChangedAt: Date,
    role: {
        type: String,
        enum: ["admin", "guide", "user"],
        default: "user"
    },

    passwordResetToken: String,
    passwordTokenExp: Date,

    admin:{
        type: mongoose.Schema.ObjectId,
        // default: ObjectId("6655edd3cfbe1e3d0dbf257d")
    },
    chatJoined: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tour",
            default: null
            // unique: [true, "An user cannot join duplicate chat"]
        }
    ],

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tour: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Tour'
    },
    detail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Details'
    },
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
}
)



UserSchema.pre(/^find/, function(next){
    this.populate({
        path: "tour",
        select: "name price image",
    }).populate({
        path: "detail"
    })

    next()
})


  

UserSchema.pre("save", async function(next){
    if(!this.isModified("password"))
    return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next()
})


UserSchema.methods.correctPassword = async function(inputPass, userPass){
    return await bcrypt.compare(inputPass, userPass);
}


const User = mongoose.model("User", UserSchema);

module.exports = User;

