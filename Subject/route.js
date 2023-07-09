const express = require("express")
const { adminAuth } = require("../Auth/middleware")
const { createSubject } = require("./subject")
const router = express.Router()

router.route("/createSubject").post(adminAuth, createSubject)
module.exports = router