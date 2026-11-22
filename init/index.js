const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing=require("../models/listing.js");
require("dotenv").config();

let MONGO_URL=process.env.ATLAS_URL;

async function main(){
  await mongoose.connect(MONGO_URL);
}

main().then((res)=>{
  console.log("Connected to DB");
}).catch((err)=>{
  console.log("unable to connect with DB");
});

const initDB = async () =>{
  await listing.deleteMany({});
  initdata.data = initdata.data.map((obj)=>({...obj,owner:"6a9855ad01ff1eab5bae83fd"}));
  await listing.insertMany(initdata.data);
  console.log("Data was initialized");
};

async function start() {
  try {
    if (!MONGO_URL) {
      throw new Error("ATLAS_URL is missing from .env");
    }

    await main();
    await initDB();

  } 
  catch (err) {
    console.error("Initialization failed:", err);
  } 
  finally {
    await mongoose.connection.close();
  }
}

start();

