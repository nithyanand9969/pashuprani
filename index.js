const express  = require("express");
const app = express();
const cors  =  require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const router = require("./routes")


dotenv.config()
app.use(cors())
app.use(express.json());
app.use(bodyParser.json({ limit: '5mb' })); // Increase limit as needed
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true })); // For form submissions

app.use("/api/v1",router)

const PORT  =  3001 || process.env.PORT

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("console Db");
        console.log(`server is using ${PORT}`);
    })
})
