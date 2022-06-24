const express = require('express')
const path = require('path');
const ejs = require("ejs")
const app = express()
const port = 3000



//create middleware for passing data----------------------
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, "css")))
app.use(express.static(path.join(__dirname, "image")))

// Set View Engion----------------------------------------------------------
app.set("view engine", "ejs");


// Models...................................................................
const userModel = require("./database_module").userModel;
const productModel = require("./database_module").productModel;
const { RSA_NO_PADDING } = require('constants');




//APIs for home-page
app.get('/', (req, res) => {
    try {

        res.sendFile(path.join(__dirname, "templates/home.html"));
    }
    catch (error) {
        res.send(error);
    }
})



//APIs for registration form----------------------------------------------------------------
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "templates/register.html"))
})

app.post("/register", async (req, res) => {
    try {
        const data = req.body;
        console.log(data)
        let newRecord = new userModel({
            "name": req.body.name,
            "mobile": req.body.mobile,
            "email": req.body.email,
            "password": req.body.password,
            "utype": req.body.utype,
            "gender": req.body.gender,
            "address": req.body.address
        });
        newRecord.save();
        res.sendFile(path.join(__dirname, "templates/login.html"))
    }
    catch (error) {
        res.send("Not Submiitted")
    }

})

//APIs for login form---------------------------------------------------------------------------
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "templates/login.html"))
})

app.post("/login/", async (req, res) => {
    try {
        const entered_email = req.body.email;
        const entered_password = req.body.password;
        console.log(entered_email, entered_password)
        const fetched_data = await userModel.findOne({ "email": entered_email });
        console.log(fetched_data)
        const product = await productModel.find();
        console.log(product[0]["title"])
        if (fetched_data.password == entered_password) {
            res.render("user-dashboard", {
                data: fetched_data,
                product: product
            });

        }
        else {
            res.sendFile(path.join(__dirname, "templates/register.html"))
        }
    }
    catch (error) {
        res.send(error + "Account Not Found")
    }
    //console.log(data["Name"])
})

// APIs for product--------------------------------------------------------------------------------


//user-dashboard------------------------------------------------
app.get("/user-dashboard", async (req, res) => {
    try {
        let data = await productModel.find();
        console.log("Hello World..");
        res.render("user-dashboard", {
            product: data
        });
    }
    catch (error) {
        res.send(error);
    }

})

// Profile------------------------
app.get("/profile", (req, res) => {
    try {
        res.render("profile")
    }
    catch (error) {
        res.send(error)
    }
});

// Orderd Product---------------------------------------------------------
app.get("/ordered_product", (req, res) => {
    try {
        res.render("ordered_product")
    }
    catch (error) {
        res.send(error);
    }
})

// Transaction History---------------------------------------------------------
app.get("/transaction_history", (req, res) => {
    try {
        res.send("Hello World" + req.params.name)
    }
    catch (error) {
        res.send(error);
    }
})

// Strat Local host port
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})