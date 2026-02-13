import express from "express" 
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { routeHandlers } from "./route/route";
import cors from 'cors';

const app = express();

app.use(cors({
    origin : process.env.APP_URL,
    credentials : true ,
}))
app.use(express.json());

app.all("/api/auth/*splat",toNodeHandler(auth));

app.get("/",(req,res) => {
    res.status(200).send('hello world')
});

app.use("/api/v1",routeHandlers);

export default app;