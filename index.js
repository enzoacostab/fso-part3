const express=require('express');
require('dotenv').config();
const morgan=require('morgan');
const Person=require('./models/person');
const { default: mongoose } = require('mongoose');
const app=express();


app.use(express.json());

morgan.token('data', (req,res)=>{
    return JSON.stringify({name:req.body.name,number:req.body.number})
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.use(express.static('build'));


app.get('/api/persons', (req, res, next) => {
    Person.find({})
    .then(r=>res.json(r))
    .catch(error=>next(error))
  })
  
app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
    .then(r=>r ? res.json(r) : res.status(404).end())
    .catch(error=>next(error))
  })

app.get('/info', (req, res, next) => {
  async function getUserCount() {
    const count = await Person.countDocuments({});
    res.send(`Phonebook has info for ${count} persons - ${new Date()}`)
  }
  getUserCount().catch(error=>next(error))
})
  
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id).then(r => {
      res.status(204).end()
    })
    .catch(error => next(error));
})

app.put('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true})
  .then(r=>res.json(r))
  .catch(error => next(error));
})


app.post('/api/persons', (req, res, next) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'content missing' })
    }
    const person=new Person({
      name:body.name,
      number:body.number.toString()
    })
    person.save().then(r=>res.json(r)).catch(error=>next(error))
  })


  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
  app.use(errorHandler)



const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})