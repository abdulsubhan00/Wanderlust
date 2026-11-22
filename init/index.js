require("dotenv").config({ path: "../.env" });

const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.ATLAS_URL;

const initDB = async () => {
    await Listing.deleteMany({});

    initdata.data = initdata.data.map((obj) => ({
        ...obj,
        owner: "6ada4b58ffdb95d7b2c9187c"
    }));

    await Listing.insertMany(initdata.data);

    console.log("Data was initialized successfully");
};

async function start() {
    try {
        if (!MONGO_URL) {
            throw new Error("ATLAS_URL is missing from .env");
        }

        console.log("Attempting to connect to Atlas...");

        await mongoose.connect(MONGO_URL, {
          serverSelectionTimeoutMS: 10000
        });

        console.log("Connected to MongoDB Atlas");

        await initDB();

    } catch (err) {
        console.error("Initialization failed:", err);
    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed");
    }
}

start();
