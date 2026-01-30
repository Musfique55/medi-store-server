import app from "./app";

const PORT = process.env.PORT || 5000;


app.get("/",(req,res) => {
    res.status(200).send('hello world')
})

app.listen(PORT,() => {
    console.log("port is running on",PORT);
})