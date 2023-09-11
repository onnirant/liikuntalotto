const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('Connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(result => {
  console.log('Connected to MongoDB sport schema')
}).catch((error) => {
  console.log('Error connecting to MongoDB sport schema:', error.message)
})


const sportSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 1,
    required: true
  },
  raatti: {
    type: Boolean,
    required: true
  },
  indoor: {
    type: Boolean,
    required: true
  },
  lastdone: {
    type: Number,
    required: true
  }
}
)

sportSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Sport', sportSchema)