//  Import All dependcies-----------------------------------------------------------

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

//Import All your model---------------------------------------------------------------
const userModel=require("./database_module").userModel
const productModel=require("./database_module").productModel;
const transactionModel=require("./database_module").transactionModel;
const orderedModel=require("./database_module.js").orderedModel;
const accountModel=require("./database_module.js").accountModel;
const cartModel=require("./database_module.js").cartModel;



const { ObjectId } = require("bson");
const { now } = require("mongoose");
const { resolveNaptr } = require("dns");
const { readdirSync } = require("fs");
const port=3000;
var username=""
var user=""
var product=""
var buy_new_product=""
var temp1=""
var temp2=""

// Set View Engion---------------------------------------------------------------------
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

//----------------------------------------------------------ROUTE FOR REGISTER------------------------------------------------------------

app.route("/new-register")
.get(sessionChecker,(req,res)=>{
    res.sendFile(path.join(__dirname,"/templates/new-register.html"))
})
app.post("/new-register",(req,res)=>{
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

//----------------------------------------------------------ROUTE FOR USER LOGIN------------------------------------------------------------
app
  .route("/new-login")
  .get(sessionChecker, (req, res) => {
    res.sendFile(path.join(__dirname + "/templates/new-login.html"));
  })
  .post(async (req, res) => {
    username = req.body.email;
    var password = req.body.password;

    console.log(username,password)
      try {
        user = await userModel.findOne({ email: username }).exec();
        console.log(user,"login")
        
        // if(!user) {
        //     console.log("account not matched from database..")
        //     res.redirect("/login");
        // }
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

//----------------------------------------------------------ROUTE FOR ADMIN'S DASHBOARD------------------------------------------------------------
app.get("/admin-dashboard", async(req, res) => {
	// console.log(user, "user-dashboard login")
	res.sendFile(path.join(__dirname,"/templates/admin.html"))
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
      
           transaction=await transactionModel.find({"user":username}).exec();
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
.get(async(req,res)=>{
    try{
        if (req.session.user && req.cookies.user_sid){

          //get product detail.......
          product=await productModel.findOne({"_id":"61552441987a4cc76db4f1bd"})
          console.log(product)
          newRecord=new cartModel({
            user:username,
            product:product['title'],
            price:product['price'],
            quantity:product['quantity'],
 
          })
          newRecord.save().then(result=>{
            res.redirect("user-dashboard")
          }).catch(error=>{
            console.log(error)
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

app.get("/total-carts",async(req,res)=>{
  try{
    if(req.session.user && req.cookies.user_sid){
      data=await cartModel.find({user:username}).then(result=>{
        res.render("carts",{
          product:result
        })
      }).catch(err=>{
        console.log(err)
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
        
         buy_new_product=await productModel.findOne({"_id":req.params.id})
         
         res.render("buy-now",{
           product:buy_new_product,
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

app.post("/buy-now",async(req,res)=>{
  try{
     if(req.session.user && req.cookies.user_sid){
      data=req.body;
      console.log(data,"Majnu bhai")
      var account=await accountModel.findOne({"user_id":data["email"]}).exec();
      
      paidAmount=buy_new_product['price']*data['quantity']
      //Update User Balance.........................
      if(account['balance']>=paidAmount){
        
    
        await accountModel.findOneAndUpdate({"bank_user_id":data["email"]},{
          $set:{
            balance:account['balance']-paidAmount
          }
        }).then(result1=>{
          console.log("Balance Updated..")
          temp1=1
        }).catch(error=>{
          res.send("<h1>Failed to pay..</h1>")
        })
         

        //Update Quantity of Product..........
        if(buy_new_product['quantity']<data['quantity']){
          res.send("Product is not avaiable in stock....")
        }
        else{
          await productModel.findOneAndUpdate({"_id":buy_new_product['_id']},{
            $set:{
              quantity:buy_new_product['quantity']-data['quantity']
            }
          }).then(result2=>{
            console.log("Quantity Updated....")
            temp2=1
            
          }).catch(error=>{
            res.send("Failed to update product amount")
          })

          // Check Whether all functions are done or not
          if(temp1 && temp2){
            res.redirect("/user-dashboard")
          }
          else{

            //if transaction is done but order doesn't take place then update reduced balane
            if(!temp2){
              await accountModel.findOneAndUpdate({"bank_user_id":data["email"]},{
                $set:{
                  balance:account['balance']+paidAmount
                }
              })
            }
          }
          
        }

      
        // Set Transaction History to database.....................
        const transactionHistory=new transactionModel({
          user:username,
          userid:data["email"],
          product:buy_new_product["title"],
          price:buy_new_product["price"],
          quantity:data["quantity"],
          amount:buy_new_product['price']*data['quantity']

      })

      transactionHistory.save()

       console.log(buy_new_product["address"])
      //SET ORDERED PRODUCT TABLE------------------------------------
      const orderedProduct=new orderedModel({
        user:username,
        userid:data["email"],
        product:buy_new_product["title"],
        price:buy_new_product["price"],
        quantity:data['quantity'],
        amount:buy_new_product['price']*data['quantity'],
        address:data['address'],
        status:"pending"
        

    })

       orderedProduct.save()
       res.redirect("/user-dashboard")



       
      }
      else{
        res.send("Insufficient Amount..")
      }
     }
    else{
      res.redirect("/login")
    }
}
catch(err){
  console.log(err)
}
});

//---------------------------------------------------------ROUTE FOR PRODUCT---------------------------------
app.get("/product/:id",async(req,res)=>{
  try{
    if(req.session.user && req.cookies.user_sid){
      console.log(req.params.id)
      await productModel.findOne({"_id":req.params.id}).then(result=>{
        res.render("product",{
          product:result
        })
      }).catch(err=>{
        res.send(err)
      })
     
    }
    else{
      redirect("/login")
    }
  }
  catch(err){
    console.log(err)
  }
})

//----------------------------------------------------------ROUTE FOR ORDERED PRODUCT------------------------------------------------------------
app.get("/ordered_product",async(req,res)=>{
   try{
      if(req.session.user && req.cookies.user_sid){
        
          var ordered_product=await orderedModel.find({user:username}).exec();
       
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

app.route("/feedback",async(req, res) => {
	res.sendFile(path.join(__dirname, "templates/feedback.html"))
}).post(async (req, res) => {
	var fname = req.body.firstname,
	lname = req.body.lastname,
	areacode = req.body.areacode,
	telnum = req.body.telnum,
	email = req.body.email,
	may_we_contact = req.body.approve
})


  // route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!");
  });

app.listen(port,()=>{
    console.log(`Linstening to port http://localhost:${port}`);
})