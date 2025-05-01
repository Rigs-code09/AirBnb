if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}

const express = require("express");
const app=express();
const mongoose = require("mongoose");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError =require("./utils/ExpressError.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const Localstrategy=require("passport-local");
const User=require("./models/user.js");

const listingsRouter=require("./routes/listings.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

main()
.then( () =>{
    console.log("Connected to DB");
})
.catch((err) =>{
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret : "mysupersecretcode",
    resave: false ,
    saveUninitialized: true ,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
};

app.get("/",(req,res) =>{
    res.send("Hi ");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // to add those in session
passport.deserializeUser(User.deserializeUser());// remove from the session entry as they go

app.use((req,res,next) =>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.get("/register" ,async (req,res) =>{
//     let newuser=new User({
//          email: "student@123",
//          username: "fakeuser",
//      });
 
//     let registeredUser = await User.register(newuser, "helloworld");// this method itself adds a new user with given password 
//      //and also checks wheather it is unique or not
//     res.send(registeredUser);
// });


//Routes
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*",(req,res,next) => {
    next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next) => {
    let{status=500,message="something went wrong"} = err;
    // res.status(status).send(message);
    // res.send("something went wrong");
    res.render("error.ejs" , {err});
});

app.listen(8080,()=>{
    console.log("server is listening");
}); 