const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");

const listingSchema = new Schema({
    title: {
        type: String,
    },

    description: {
        type: String,
    },

    image: {
        url : String,
        filename : String,
    },

    price: {
        type: Number,
        default: 1000,
    },

    location: {
        type: String
    },

    country: {
        type: String
    },

    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],

    owner : {
        type:Schema.Types.ObjectId,
        ref:"User"
    },

    geometry : {
        type : {
            type : String,
            enum : ['Point'],
            required : true
        },
        coordinates : {
            type : [Number],
            required : true
        }
    },
    tags: {
        type: [{
            type: String,
            enum: [
                "Rooms",
                "Iconic Cities",
                "Hills",
                "Castles",
                "Pools",
                "Camping",
                "Farms",
                "Arctic",
                "Domes",
                "Boats"
            ]
        }],
        default: [],
        validate: [
            {
                validator: function (value) {
                    return value.length >= 1;
                },
                message: "Please select at least one tag."
            },
            {
                validator: function (value) {
                    return value.length <= 2;
                },
                message: "You can select a maximum of 2 tags."
            }
        ]
    },
});

const Listing = mongoose.model("Listing", listingSchema);
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in : listing.reviews}});
    }
});

module.exports = Listing;