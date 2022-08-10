const mongoose = require("mongoose");



const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI, {  useNewUrlParser: true, useUnifiedTopology: true }).then((data)=>{
      console.log(`mongodb connected with server :${data.connection.host}`);
    });

// do not need to use catach
};

module.exports = connectDatabase