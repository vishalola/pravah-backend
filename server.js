import express from "express";
import bodyParser from "body-parser";
import { connectDB } from "./config/db.config.js";
import authRoutes from "./routes/auth.route.js"
const app = express();
app.use(bodyParser.json());
app.get("/", (req,res)=>{
    res.send("hello world");
})

app.use("/auth", authRoutes)
connectDB().then(()=>{
    app.listen(5000, ()=>{
        console.log("server listening on port 5000")
    })
})
