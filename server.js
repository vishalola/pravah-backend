import express from "express";
import bodyParser from "body-parser";
import { connectDB } from "./config/db.config.js";
import authRoutes from "./routes/auth.routes.js"
import projectRoutes from "./routes/project.routes.js"
import { verifyUser  } from "./middlewares/auth.middleware.js";
import taskRoutes from "./routes/task.routes.js"

const app = express();
app.use(bodyParser.json());
app.get("/", (req,res)=>{
    res.send("hello world");
})

app.use("/auth", authRoutes)
app.use("/project", verifyUser, projectRoutes)
app.use("/task", verifyUser, taskRoutes)

connectDB().then(()=>{
    app.listen(5000, ()=>{
        console.log("server listening on port 5000")
    })
})
