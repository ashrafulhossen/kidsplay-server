const express = require("express");
const cors = require("cors");
require("dotenv").config;

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get("/", (req, res) =>{
    res.send("KidsPlay server is running........");
})

app.listen(port, () => {
    console.log(`KidsPlay server is running on port ${port}`);
})