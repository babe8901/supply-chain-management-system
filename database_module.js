
const mongoose = require("mongoose");

const username = "agrian-mongodb";
const password = "2wJ6irKhCuC5FTLuGNMrRFUuLebpttRiAV6I8R09yf9aLOIQY17IRQVuwhfvVU2GKqX5nZud0oTlKA9Jfnoorg==";
var url = `mongodb://agrian-mongodb:2wJ6irKhCuC5FTLuGNMrRFUuLebpttRiAV6I8R09yf9aLOIQY17IRQVuwhfvVU2GKqX5nZud0oTlKA9Jfnoorg==@agrian-mongodb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@agrian-mongodb@`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to database.."))
    .catch((error) => console.log(error))

//create schema for user
const userData = new mongoose.Schema({
    "name": String,
    "mobile": Number,
    "email": String,
    "password": String,
    "utype": String,
    "gender": String,
    "address": String
}, { collection: "userData" });

const userModel = mongoose.model("userData", userData);

module.exports.userModel = userModel;



//create schema for product----------------------------- PRODUCT --------------------
const product = new mongoose.Schema({
    "title": String,
    "type": String,
    "image": String,
    "description": String,
    "price": Number,
    "quantity": Number
}, { collection: "product" });


const productModel = mongoose.model("product", product);
module.exports.productModel = productModel;

//create Schem for transaction history
const transaction_history = new mongoose.Schema({
    "user": String,
    "userid": String,
    "product": String,
    "price": Number,
    "quantity": Number,
    "amount": Number,
    "date": {
        type: Date,
        default: Date.now
    }
}, { collection: "transaction_history" })
const transactionModel = mongoose.model("transaction_history", transaction_history)
module.exports.transactionModel = transactionModel



//Create Schema for ordered products
const ordered_product = new mongoose.Schema({
    "user": String,
    "userid": String,
    "product": String,
    "price": Number,
    "quantity": Number,
    "amount": Number,
    "address": String,
    "date": {
        type: Date,
        default: Date.now
    },
    "status": String

}, { collection: "ordered_product" })

const orderedModel = mongoose.model("ordered_product", ordered_product)
module.exports.orderedModel = orderedModel

//create schema for account
const user_account = new mongoose.Schema({
    "bank_user_id": String,
    "password": String,
    "balance": Number
}, { collection: "user_account" })

const accountModel = mongoose.model("user_account", user_account)
module.exports.accountModel = accountModel;


//-----------------------------------------------------------SCHEMA FOR CARTS--------------------------------
const cart = new mongoose.Schema({
    "user": String,
    "product": String,
    "price": Number,
    "quantity": Number,

}, { collection: "cart" })

const cartModel = mongoose.model("cart", cart)
module.exports.cartModel = cartModel


//Create schema for feedback
const message = new mongoose.Schema({
    "f_name": String,
    "l_name": String,
    "area_code": String,
    "tel_num": Number,
    "email": String,
    "may_we_contact": String,
    "how_to_contact": String,
    "feedback": String,
    "datetime": { type: Date, default: Date.now }
}, { collection: "message" })

const messageModel = mongoose.model("message", message)
module.exports.messageModel = messageModel
//-------------------------------------------------- FEEDBACK SCHEMA -------------------------
const feedback = new mongoose.Schema({
    "userName": String,
    "product_id": String,
    "feedback": String,
    "date": {
        type: Date,
        default: Date.now
    }
}, { collection: "feedback" })

const feedbackModel = mongoose.model("feedback", feedback)
module.exports.feedbackModel = feedbackModel
