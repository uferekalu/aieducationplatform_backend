const express = require("express");
const connectDB = require("./lib/db");
const cookieParser = require("cookie-parser");
const { adminAuth, userAuth } = require("./Auth/middleware");
const app = express()
const PORT = 5000

//Connecting the Database
connectDB();

app.use(express.json())
app.use(cookieParser());

app.use("/api/auth", require('./Auth/route'))
app.use("/api/subject", require("./Subject/route"))
app.get("/admin", adminAuth, (req, res) => res.send("Admin Route"))
app.get("/basic", userAuth, (req, res) => res.send("User Route"))

app.get("/logout", (req, res) => {
    res.cookie("jwt", "", { maxAge: "1" })
    res.redirect("/")
})

const server = app.listen(PORT, () =>
  console.log(`Server Connected to port ${PORT}`)
)

// Handling Error
process.on("unhandledRejection", err => {
  console.log(`An error occurred: ${err.message}`)
  server.close(() => process.exit(1))
})