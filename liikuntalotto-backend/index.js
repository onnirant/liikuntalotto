require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Sport = require('./models/sport')
const Settings = require('./models/settings')
const { response } = require('express')

/*KOMMENTTI POIS ENNEN DEPLOYTA*/
app.use(express.static('build'))

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('<h1>Liikunta-arvonta backend</h1>')
})

// AsetusJSON:n haku
app.get('/api/settings/0', (request, response) => {
  Settings.findOne({ settingsid: 0 }).then(settings => {
    if (settings) {
      response.json(settings)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

// AsetusJSON:n luonti, käytetään vain kerran!
app.post('/api/settings', (request, response, next) => {
  const body = request.body

  if (body.settingsid === undefined) {
    return response.status(400).json({
      error: 'settings id missing!'
    })
  }

  const settings = new Settings({
    settingsid: body.settingsid,
    raatti: body.raatti,
    sportday: body.sportday,
    winnersportindoorid: body.winnersportindoorid,
    winnersportoutdoorid: body.winnersportoutdoorid,
    winnersportdate: body.winnersportdate
  })

  settings
    .save()
    .then(savedSettings => {
      response.json(savedSettings)
      console.log("Settings changed to raatti=" + savedSettings.raatti + " winnersportindoorid=" + savedSettings.winnersportindoorid + " winnersportoutdoorid=" + savedSettings.winnersportoutdoorid + " winnersportdate=" + savedSettings.winnersportdate)
    })
    .catch(error => next(error))
})

// AsetusJSON:n muuttaminen
app.put('/api/settings/0', (request, response, next) => {
  const body = request.body

  //Huom, ei luoda uutta Settings-oliota, koska muokataan olemassa olevaa objektia
  const settings = {
    settingsid: body.settingsid,
    raatti: body.raatti,
    sportday: body.sportday,
    winnersportindoorid: body.winnersportindoorid,
    winnersportoutdoorid: body.winnersportoutdoorid,
    winnersportdate: body.winnersportdate
  }

  Settings.findOneAndUpdate({ settingsid: 0 }, settings)
    .then(updatedSettings => {
      response.json(updatedSettings.toJSON())
      console.log("Settings changed to raatti=" + updatedSettings.raatti + " winnersportindoorid=" + updatedSettings.winnersportindoorid + " winnersportoutdoorid=" + updatedSettings.winnersportoutdoorid + " winnersportdate=" + updatedSettings.winnersportdate)
    })
    .catch(error => next(error))
})
  
app.get('/api/sports', (request, response) => {
  Sport.find({}).then(sports => {
    response.json(sports)
  })
})
  
app.get('/api/sports/:id', (request, response, next) => {
  Sport.findById(request.params.id)
    .then(sport => {
      if (sport) {
        response.json(sport)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})
  
app.post('/api/sports', (request, response, next) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({
      error: 'sport name missing!'
    })
  }

  const sport = new Sport({
    name: body.name,
    raatti: body.raatti,
    indoor: body.indoor,
    lastdone: body.lastdone
  })

  sport
    .save()
    .then(savedSport => {
      response.json(savedSport)
    })
    .catch(error => next(error))
})
  
app.delete('/api/sports/:id', (request, response, next) => {
  Sport.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
  
app.put('/api/sports/:id', (request, response, next) => {
  const body = request.body

  const sport = {
      name: body.name,
      raatti: body.raatti,
      indoor: body.indoor,
      lastdone: body.lastdone
  }

  Sport.findByIdAndUpdate(request.params.id, sport, { new: true })
    .then(updatedSport => {
      response.json(updatedSport.toJSON())
    })
    .catch(error => next(error))
})
  
const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: 'unknown endpoint'
  })
}

app.use(unknownEndpoint)
  
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
  
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})