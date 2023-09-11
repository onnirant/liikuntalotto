const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(result => {
  console.log('connected to MongoDB settings schema')
}).catch((error) => {
  console.log('error connecting to MongoDB settings schema:', error.message)
})

const settingsSchema = new mongoose.Schema({
    settingsid: {
        type: Number,
        required: true
    },
    raatti: {
      type: Boolean,
      required: true
    },
    sportday: {
      type: Number,
      required: true
    },
    winnersportindoorid: {
      type: String,
      required: false
    },
    winnersportoutdoorid: {
      type: String,
      required: false
    },
    winnersportdate: {
      type: String,
      required: false
    }
})

settingsSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id
      delete returnedObject._id
      delete returnedObject.__v
    }
 })

 module.exports = mongoose.model('Settings', settingsSchema)