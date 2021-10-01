var bodyParser=require("body-parser");
var cookieParser=require("cookie-parser");
var session=require("express-session");
var morgan=require("morgan");
var bcrypt=require("bcrypt")
var path=require("path")
const ejs=require("ejs")
const express=require("express");
const { urlencoded } = require("body-parser");
const app=express();
const userModel=require("./database_module").userModel
const productModel=require("./database_module").productModel;
const transactionModel=require("./database_module").transactionModel;
const orderedModel=require("./database_module.js").orderedModel;
const { ObjectId } = require("bson");
const { now } = require("mongoose");
const port=3000;
var username=""
var user=""
var product=""

// Set View Engion----------------------------------------------------------
app.set("view engine","ejs");


//Middle wares
app.use(express.static(path.join(__dirname,"css")))
app.use(express.static(path.join(__dirname,"js")));
app.use(express.static(path.join(__dirname,"image")))
app.use(bodyParser(urlencoded({extended:true})))

// set morgan to log info about our requests for development use.
app.use(morgan("dev"));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));





// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(
    session({
        key:"user_sid",
        secret:"thisissecretloginpage",
        resave:false,
        saveUninitialized:false,
        cookie:{
            expires:6000000
        }
    })
)
// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie("user_sid");
    }
    next();
  });
  
  // middleware function to check for logged-in users
  var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
      res.redirect("/user-dashboard");
    } else {
      next();
    }
  };



//----------------------------------------------------------ROUTE FOR HOME PPAGE------------------------------------------------------------
app.get("/", sessionChecker, (req, res) => {
    res.sendFile(path.join(__dirname,"/templates/home.html"))
  });


//----------------------------------------------------------ROUTE FOR REGISTER------------------------------------------------------------
app.route("/register")
.get(sessionChecker,(req,res)=>{
    res.sendFile(path.join(__dirname,"/templates/register.html"))
})
app.post("/register",(req,res)=>{
    try{
        password=req.body.password;
        var hash_password=bcrypt.hashSync(password,10)
        username=req.body.email
        const user=new userModel({
            name:req.body.name,
            mobile:req.body.mobile,
            email:req.body.email,
            password:hash_password,
            utype:req.body.utype,
            gender:req.body.gender,
            address:req.body.address
        })
        user.save((err,docs)=>{
            if(err){
                res.redirect("/register")
            }
            else{
                console.log(docs)
                req.session.user=docs;
                res.redirect("/user-dashboard")
            }
        });
       
    }
    catch(error){
        console.log(error)
    }
   
})



//----------------------------------------------------------ROUTE FOR USER LOGIN------------------------------------------------------------
app
  .route("/login")
  .get(sessionChecker, (req, res) => {
    res.sendFile(path.join(__dirname + "/templates/login.html"));
  })
  .post(async (req, res) => {
    username = req.body.email;
    var password = req.body.password;

    console.log(username,password)
      try {
        user = await userModel.findOne({ email: username }).exec();
        console.log(user,"login")
        
        if(!user) {
            console.log("account not matched from database..")
            res.redirect("/login");
        }
        if(user["email"]==username && bcrypt.compareSync(password, user["password"]))
        {
            req.session.user = user;
            res.redirect("/user-dashboard");
        }
        else{
            console.log("email and password are not matching..")
            res.redirect("/login")
        }
        
    } catch (error) {
      console.log(error)
    }
  });



//----------------------------------------------------------ROUTE FOR USER'S DASHBOARD------------------------------------------------------------
app.get("/user-dashboard", async(req, res) => {
    //console.log(user,"user-dashboard login")
    user = await userModel.findOne({ email: username }).exec();
    product=await productModel.find().exec();
    //console.log(user)
    //console.log(product)
    if (req.session.user && req.cookies.user_sid) {
      res.render("user-dashboard",{
          user:user,
          product:product
      })
    } else {
      res.redirect("/login");
    }
  });
  


//----------------------------------------------------------ROUTE FOR LOGOUT------------------------------------------------------------
app.get("/logout", (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      res.clearCookie("user_sid");
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  });





//----------------------------------------------------------ROUTE FOR TRANSACTION HISTORY------------------------------------------------------------
app.route("/transaction_history")
.get(async(req,res)=>{
    try{
        if (req.session.user && req.cookies.user_sid){
           transaction=await transactionModel.find({"email":username}).exec();
           console.log(transaction)
           console.log("Hello Transaction History",username)
            res.render("transaction_history",{
              transaction:transaction
            })
        }
        else {
            res.redirect("/login");
          }
    }
    catch(err){
        console.log(err)
    }
    
    
})


//----------------------------------------------------------ROUTE FOR DELETE TRANSACTION------------------------------------------------------------

app.get("/delete_transaction/:id",async(req,res)=>{
    try{
        if (req.session.user && req.cookies.user_sid){
          
            await transactionModel.deleteOne({_id:req.params.id}).then(result=>{
              res.redirect("/transaction_history")
            }).catch(err=>{
              res.send(err)
            })
            
        }
        else {
            res.redirect("/login");
          }
    }
    catch(err){
        console.log(err)
    }
    
    
})



//----------------------------------------------------------ROUTE FOR CARTS------------------------------------------------------------
app.route("/carts")
.get((req,res)=>{
    try{
        if (req.session.user && req.cookies.user_sid){
            res.render("carts")
        }
        else {
            res.redirect("/login");
          }
    }
    catch(err){
        console.log(err)
    }
    
    
})

//----------------------------------------------------------ROUTE FOR PROFILE---------------------------------------------------
app.route("/profile")
.get((req,res)=>{
    try{
        
        //const email=req.body.username;
        if (req.session.user && req.cookies.user_sid){
            res.render("profile",{
                user:user
            })
        }
        else {
            res.redirect("/login");
          }
    }
    catch(err){
        console.log(err)
    }
    
    
})




//----------------------------------------------------------ROUTE FOR EEDIT PROFILE------------------------------------------------------------
app.get("/edit-profile",(req,res)=>{
    try{
       console.log(req.body)
      
       if(req.session.user && req.cookies.user_sid){
           
            res.render("edit-profile",{
              user:user
          })
             
        
           
          
       }
       else{
         res.redirect("/login")
       }
    }
    catch(err){
        console.log(err)
    }
})
app.post("/edit-profile",async(req,res)=>{
  try{
     console.log(req.body)
     console.log(username)
     if(req.session.user && req.cookies.user_sid){  
          await userModel.findOneAndUpdate({"email":username},{
            $set:{
              name:req.body.name,
              mobile:req.body.mobile,
              email:req.body.email,
              
              utype:req.body.utype,
              gender:req.body.gender,
              address:req.body.address

            }
          }).then(result=>{
            res.redirect("/user-dashboard")
          })
          .catch(err=>{
            console.log("Failed to update")
          })
        
     }
     else{
       res.redirect("/login")
     }
  }
  catch(err){
      console.log(err)
  }
})





//----------------------------------------------------------ROUTE FOR ORDERED BUY-NOW----------------------------------------------
app.get("/buy-now/:id",async(req,res)=>{
  try{
     if(req.session.user && req.cookies.user_sid){
    
      console.log("Hello World..",req.params.id)
     
     
      productModel.findOne({_id:req.params.id}, function(error,doc) {
      if (error) {
        console.log(error);
      } else {
         res.redirect("/buy-now")
      }
  });
  
  }
}
catch(err){
  console.log(err)
}
});

app.get("/buy-now",(req,res)=>{
  try{
     if(req.session.user && req.cookies.user_sid){
    
      res.render("buy-now")
     
  
  }
}
catch(err){
  console.log(err)
}
});


//----------------------------------------------------------ROUTE FOR ORDERED PRODUCT------------------------------------------------------------
app.get("/ordered_product",async(req,res)=>{
   try{
      if(req.session.user && req.cookies.user_sid){
        console.log("Hello My love",username)
          var ordered_product=await orderedModel.find({userid:username}).exec();
       
          res.render("ordered_product",{
            ordered_product:ordered_product
          })
      }
      else{
        ejs.redirect("/login")
      }

   }
   catch(err){
     cconsole.log(err)
   }
})


  // route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!");
  });

app.listen(port,()=>{
    console.log(`Linstening to port http://localhost:${port}`);
})