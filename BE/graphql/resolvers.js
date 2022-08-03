const bcrypt = require("bcryptjs")
const validator = require("validator")

const User = require("../models/user")

module.exports = {
  createUser: async function ({ userInput }) {
    const errors = []
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "email is invalid" })
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 2 })
    ) {
      errors.push({ message: "password too short" })
    }
    if (errors.length) {
      const error = new Error("Invalid input.")
      error.data = errors
      error.code = 422
      throw error
    }
    const existingUser = await User.findOne({ email: userInput.email })

    if (existingUser) {
      const error = new Error("User exists already")
      throw error
    }

    const hashedPass = await bcrypt.hash(userInput.password, 12)
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPass,
    })

    const createdUser = await user.save()
    // use ._doc to get rid of mongoose metadata and ._od to transform from ObjectId => String
    return { ...createdUser._doc, _id: createdUser._id.toString() }
  },
  // another option
  // createUser(args, req) {
  // const email = args.userInput.email
  // },
}
