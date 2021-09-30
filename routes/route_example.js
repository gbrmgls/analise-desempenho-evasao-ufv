const express = require("express");
const db = require("../database.js")
const router = express.Router();

router.get("/", (req, res, next) => {
    res.status(200).send("Hello!");
});

router.get("/:id", (req, res, next) => {
    res.status(200).send(`Hello! Parameter: ${req.params.id}`);
});

module.exports = router;
