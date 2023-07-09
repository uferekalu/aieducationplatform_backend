const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
require('dotenv').config()

const register = async (req, res, next) => {
    const { name, email, password } = req.body
    if (password.length < 5) {
        return res.status(400).json({ message: "Password must be at least 6 characters" })
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" })
    }
    try {
        bcrypt.hash(password, 10).then(async (hash) => {
            await User.create({
                name,
                email,
                password: hash
            }).then((user) => {
                const maxAge = 3 * 60 * 60
                const token = jwt.sign(
                    {
                        id: user._id,
                        name,
                        email,
                        role: user.role
                    },
                    process.env.jwtSecret,
                    {
                        expiresIn: maxAge, // 3hrs in sec
                    }
                )
                res.cookie("jwt", token, {
                    httpOnly: true,
                    maxAge: maxAge * 1000. // 3hrs in ms
                })
                res.status(201).json({
                    message: "User successfully created",
                    user
                })
            })
        })
      } catch (error) {
        res.status(400).json({
        message: "An error occured",
        error: error.mesage
        })
      }
    
}

const login = async (req, res, next) => {
    const { email, password } = req.body
    // Check if username and password are provided
    if (!email || !password) {
        return res.status(400).json({
            message: "Email or Password not present",
        })
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            res.status(400).json({
                message: "Login not successful",
                error: "User not found"
            })
        } else {
            // comparing given password with hashed password
           bcrypt.compare(password, user.password).then(function (result) {
            if (result) {
                const maxAge = 3 * 60 * 60
                const token = jwt.sign(
                    {
                        id: user._id,
                        email,
                        role: user.role
                    },
                    process.env.jwtSecret,
                    {
                        expiresIn: maxAge
                    }
                )
                res.cookie("jwt", token, {
                    httpOnly: true,
                    maxAge: maxAge * 1000
                })
                res.status(200).json({
                    message: "User successfully logged in",
                    token
                })
            } else {
                res.status(400).json({
                    message: "Login not successful"
                })
            }
           })
        }
    } catch (error) {
        res.status(400).json({
            message: "An error occured",
            error: error.message
        });
    }
}

const update = async (req, res, nex) => {
    const { role, id } = req.body
    if (role && id) {
        if (role === "admin") {
            await User.findById(id).then((user) => {
                if (user.role !== "admin") {
                    user.role = role
                    user.save()
                    res.status(201).json({ message: "Update successful", user });
                } else {
                    res.status(400).json({ message: "User is already an admin" })
                }
            }).catch((error) => {
                res.status(400).json({ message: "An error occured", error: error.message })
            })
        } else {
            res.status(400).json({
                message: "Role is not admin",
            })
        }
    } else {
        res.status(400).json({ message: "Role or Id not present" })
    }
}

const deleteUser = async (req, res, next) => {
    const { role, id } = req.body
    if (role && id) {
        if (role === "admin") {
            await User.findByIdAndRemove(id)
            res.status(200).json({
                message: "User deleted successfully"
            })
        } else {
            res.status(400).json({
                message: "Role is not admin",
            })
        }
    } else {
        res.status(400).json({ message: "Role or Id not present" })
    }
}

const getUsers = async (req, res, next) => {
    await User.find({})
      .then(users => {
        const userFunction = users.map(user => {
          const { _id, name, email, role } = user
          return {
            _id,
            name,
            email,
            role
          }
        })
        res.status(200).json({ user: userFunction })
      })
      .catch(err =>
        res.status(401).json({ message: "Not successful", error: err.message })
      )
  }

module.exports = {
    register,
    login, 
    update,
    deleteUser,
    getUsers
}