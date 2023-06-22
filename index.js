const express=require('express');
const morgan=require('morgan');
const app=express();

app.use(express.json());

morgan.token('data', (req,res)=>{
    return JSON.stringify({name:req.body.name,number:req.body.number})
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.use(express.static('build'));


let persons=[
    {
      name: 'Arto Hellas',
      number: '040-123456',
      id: 1
    },
    {
      name: 'Ada Lovelace',
      number: '39-44-5323523',
      id: 2
    },
    {
      name: 'Dan Abramov',
      number: '12-43-234345',
      id: 3
    },
    {
      name: 'Mary Poppendieck',
      number: '39-23-6423122',
      id: 4
    }
  ];

app.get('/api/persons', (req, res) => {
    res.json(persons)
  })
  
app.get('/api/persons/:id', (req, res) => {
    let id=Number(req.params.id);
    let person=persons.find(person=>person.id===id);
    if (person){
        res.json(person);
    }
    else{
        res.status(404).end();
    }
  })

app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${persons.length} persons${new Date()}`)
})
  
app.delete('/api/persons/:id', (req, res) => {
    let id=Number(req.params.id);
    persons=persons.filter(person=>person.id!==id);
    res.status(204).end()
  })

app.post('/api/persons', (req, res) => {
    const body = req.body;
    let na=persons.find(p=>p.name===body.name);
    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'content missing' })
    }
    else if (na){
        return res.status(400).json({ error: 'name must be unique' })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: Math.round(Math.random()*10000),
    }

    persons = persons.concat(person)
    res.json(person)
})


app.put('/api/persons/:id',(req,res)=>{
  let id=Number(req.params.id)
  let body=req.body
  persons=persons.map(per=>per.id===id ? body : per) 
  console.log(body);
  res.json(body)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})