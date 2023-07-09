const Subject = require("../models/Subject")

const createSubject = async (req, res, next) => {
    const { name, description } = req.body
    // Check if name and description are provided
    if (!name) {
        return res.status(400).json({
            message: "name of the subject is required",
        })
    }
    if (!description) {
        return res.status(400).json({
            message: "description of the subject is required",
        })
    }
    const existingSubject = await Subject.findOne({ name })
    if (existingSubject) {
        return res.status(400).json({ message: `Subject with name "${name}" already exists` })
    }

    try {
        await Subject.create({
            name,
            description
        }).then((subject) => {
            res.status(201).json({
                message: `Subject with name "${name}" created successfuly`,
                subject
            })
        })
    } catch (error) {
        res.status(400).json({
            message: "An error occured",
            error: error.mesage
        })
    }
}

module.exports = {
    createSubject
}