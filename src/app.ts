import express from "express" 
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import routes from "./route/route";

const app = express();
app.all("/api/auth/{*any}",toNodeHandler(auth))
app.use(express.json());

app.get("/",(req,res) => {
    res.status(200).send('hello world')
})

app.use("/api/v1",routes);

export default app;