const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser")


app.use(express.json())
app.use(cookieParser())
// routes Import
const product = require("./routes/productRoute");
const user= require("./routes/userRoute");

app.use("/api",product);
app.use("/api",user)

//  middleware for errore
app.use(errorMiddleware) 

module.exports = app ;