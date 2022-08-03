const bcrypt = require("bcryptjs")
const User = require("../models/user")

module.exports = {
  createUser: async function ({ userInput }) {
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
