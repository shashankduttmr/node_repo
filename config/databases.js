const mongoose = require('mongoose')


function Connect(){
    mongoose.set('strictQuery', true)
    mongoose.connect(process.env.dburl)
    .then(function(){
        console.log('Connection establiashed')
    })
    .catch(function(){
        console.log('Failed to connect');
    })
}

module.exports.Connections = Connect