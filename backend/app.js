const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser")


app.use(express.json())
app.use(cookieParser())
// routes Import
const product = require("./routes/productRoute");
const user= require("./routes/userRoute");
// const order = require("./routes/orderRoutes")

app.use("/api",product);
app.use("/api",user)
// app.use("/api",order)

//  middleware for errore
app.use(errorMiddleware) 

module.exports = app ;