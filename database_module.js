const { strictEqual } = require("assert");
const { Decimal128 } = require("bson");
const mongoose=require("mongoose");
var url = "mongodb://localhost:27017/supplyChainManagement";

mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("Connected to database.."))
.catch((error)=>console.log(error))

//create schema for user
const userData=new mongoose.Schema({
    "name":String,
    "mobile":Number,
    "email":String,
    "password":String,
    "utype":String,
    "gender":String,
    "address":String
},{collection:"userData"});

const userModel=mongoose.model("userData",userData);

module.exports.userModel=userModel;



//create schema for product----------------------------- PRODUCT --------------------
const product=new mongoose.Schema({
    "title":String,
    "type":String,
    "description":String,
    "price":Number,
    "quantity":Number
},{collection:"product"});


const productModel=mongoose.model("product",product);
module.exports.productModel=productModel;

//create Schem for transaction history
const transaction_history=new mongoose.Schema({
    "userid":String,
    "product":String,
    "price":Number,
    "quantity":Number,
    "amount":Number,
    "date":{
        type:Date,
        default:Date.now
    }
},{collection:"transaction_history"})
const transactionModel=mongoose.model("transaction_history",transaction_history)
module.exports.transactionModel=transactionModel



//Create Schema for ordered products
const ordered_product=new mongoose.Schema({
    "userid":String,
    "product":String,
    "price":Number,
    "quantity":Number,
    "amount":Number,
    "date":{
        type:Date,
        default:Date.now
    },
    "status":String

},{collection:"ordered_product"})

const orderedModel=mongoose.model("ordered_product",ordered_product)
module.exports.orderedModel=orderedModel

//Create schema for feedback
const feedback = new mongoose.Schema({
    "f_name" : String,
    "l_name" : String,
    "area_code" : String,
    "tel_num" : Number,
    "email" : String,
    "may_we_contact" : String,
    "how_to_contact" : String,
    "feedback" : String,
    "datetime" : {type : Date, default : Date.now}
}, {collection : "feedback"})

const feedbackModel = mongoose.model("feedback", feedback)
module.exports.feedbackModel = feedbackModel