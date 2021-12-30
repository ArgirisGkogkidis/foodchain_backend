const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ingridientSchema = new Schema({
    id: {type: Number, unique:true},
    name: String,
    icon: String
})

module.exports = mongoose.model('Ingridient', ingridientSchema)