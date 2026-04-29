import express from "express" 
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { routeHandlers } from "./route/route";
import cors from 'cors';
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";
import cookieParser from 'cookie-parser';
import path from 'path';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.use(cors({
    origin : process.env.APP_URL,
    credentials : true ,
}));

app.set("view-engine","ejs");
app.set("views",path.resolve(process.cwd(),"src/templates"));


app.all("/api/auth/*splat",toNodeHandler(auth));

app.get("/",(req,res) => {
    res.status(200).send('hello world')
});

app.use("/api/v1",routeHandlers);

app.use(notFound);
app.use(globalErrorHandler);

export default app;