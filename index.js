const express = require("express")
const cors = require("cors");
const path = require("path")

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// CORS middleware
app.use((req, res, next) => {
    res.append("Access-Contro-Allow-Origin", ["*"]);
    res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.append("Access-Control-Allow-Headers", "Content-Type,x-auth-token");
    next();
});

app.use(express.static(path.join(__dirname, "/front/build")))
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/front/build", "index.html"))
})

app.use("/route_example", require("./routes/route_example.js"))


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
