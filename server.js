import express from "express";
import bodyParser from "body-parser";
import { connectDB } from "./config/db.config.js";
import authRoutes from "./routes/auth.routes.js"
import projectRoutes from "./routes/project.routes.js"
import { verifyUser  } from "./middlewares/auth.middleware.js";

const app = express();
app.use(bodyParser.json());
app.get("/", (req,res)=>{
    res.send("hello world");
})

app.use("/auth", authRoutes)
app.use("/project", verifyUser, projectRoutes)

connectDB().then(()=>{
    app.listen(5000, ()=>{
        console.log("server listening on port 5000")
    })
})
