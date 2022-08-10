const app = require("./app");
const dotenv = require("dotenv")
const mongoose = require("mongoose");
const connectDatabase = require("./config/database")

//  handling uncaugt exception
process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to uncaught rejection`);
    process.exit(1)
})
// config
dotenv.config({path:"backend/config/config.env"})

// connect database
connectDatabase();


const server= app.listen(process.env.PORT,()=>

{
    console.log(`server is working on http://localhost:${process.env.PORT}`)
}
)



//  Unhandled promies rejection
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to unhandales promise rejection`);

    server.close( ()=>{
        process.exit(1);
    })
    
})