require('dotenv').config()
const mongoose = require('mongoose');
const express = require("express")
const app =express()
const bodyParser=require("body-parser");
const cookieParser=require("cookie-parser");
const cors=require("cors");

//my routes
const authRoutes=require("./routes/auth");
const userRoutes=require("./routes/user");
const categoryRoutes=require("./routes/category");
const productRoutes=require("./routes/product");
const orderRoutes=require("./routes/order");

// db connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex:true
}).then(()=>{
    console.log("DB CONNECTED");
})

// this is middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// my routes
app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);
app.use("/api",orderRoutes);


const port = 8000;

app.listen(port,()=>{
    console.log(`App is running at ${port}`)
});
