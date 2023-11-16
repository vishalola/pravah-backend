import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import { connectDB } from "./config/db.config.js";
import authRoutes from "./routes/auth.routes.js"
import projectRoutes from "./routes/project.routes.js"
import { verifyUser  } from "./middlewares/auth.middleware.js";
import taskRoutes from "./routes/task.routes.js"
import inviteRoutes  from "./routes/invite.routes.js"

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.get("/", (req,res)=>{
    res.send("hello world");
})

app.use("/auth", authRoutes)
app.use("/project", verifyUser, projectRoutes)
app.use("/task", verifyUser, taskRoutes)
app.use("/invite", verifyUser, inviteRoutes)
app.get("/fetchDetails",verifyUser,(req,res)=>{
    return res.status(200).json(req.user)
})

connectDB().then(()=>{
    app.listen(5001, ()=>{
        console.log("server listening on port 5001")
    })
})
