const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing=require("../models/listing.js");

let MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

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

initDB();

