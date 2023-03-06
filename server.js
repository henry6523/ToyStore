// server.js

const express = require('express');
const bodyParser= require('body-parser')
const app = express();

const MongoClient = require('mongodb').MongoClient

const connectionString = 'mongodb+srv://admin:admin123@cluster0.ccfliba.mongodb.net/?retryWrites=true&w=majority'

/*
MongoClient.connect(connectionString, (err, MongoClient) => {
    // ... do something here
    if (err) return console.error(err)
        console.log('Connected to Database')
})
*/

/*
MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
    })
    .catch(error => console.error(error))
*/

// (0) CONNECT: server -> connect -> MongoDB Atlas 
MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        
        // (1a) CREATE: client -> create -> database -> 'list-toys'
        // -> create -> collection -> 'list'
        const db = client.db('list-toys')
        const listCollection = db.collection('list')
        
        // To tell Express to EJS as the template engine
        app.set('view engine', 'ejs') 
        
        // Make sure you place body-parser before your CRUD handlers!
        app.use(bodyParser.urlencoded({ extended: true }))

        // To make the 'public' folder accessible to the public
        app.use(express.static('public'))

        // To teach the server to read JSON data 
        app.use(bodyParser.json())

        // (1b) CREATE: client -> index.ejs -> data -> SUBMIT 
        // -> post -> '/list' -> collection -> insert -> result
        app.post('/list', (req, res) => {
            listCollection.insertOne(req.body)
            .then(result => {
                
                // results -> server -> console
                console.log(result)

                // -> redirect -> '/'
                res.redirect('/')
             })
            .catch(error => console.error(error))
        })

        // (2) READ: client -> browser -> url 
        // -> server -> '/' -> collection -> 'list' -> find() 
        // -> results -> index.ejs -> client
        app.get('/', (req, res) => {
            db.collection('list').find().toArray()
                .then(results => {

                    // results -> server -> console
                    console.log(results)
                    
                    // results -> index.ejs -> client -> browser 
                    // The file 'index.ejs' must be placed inside a 'views' folder BY DEFAULT
                    res.render('index.ejs', { list: results })
                })
                .catch(/* ... */)
        })

        // (3) DELETE: client -> click -> 'Delete toy information'
        // -> delete -> 'Darth Vadar' 
        app.delete('/list', (req, res) => {
            listCollection.deleteOne(
                { name: req.body.name }
            )
            .then(result => {
                res.json(`Delete toy information`)
            })
            .catch(error => console.error(error))
        })

        // server -> listen -> port -> 3000
        app.listen(3000, function() {
            console.log('listening on 3000')
        })
    })





