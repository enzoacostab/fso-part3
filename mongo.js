const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://enzoacostab:${password}@cluster0.ykyf85s.mongodb.net/phonebook?retryWrites=true`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
})

if (process.argv.length === 3) {
  Person.find({}).then((res) => {
    console.log('phonebook:')
    res.forEach(person => console.log(person.name, person.number))
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  person.save().then(res => {
    console.log(`added ${res.name} number ${res.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('enter the missing data')
}
