const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
const colors = require('colors')
require('dotenv').config()

// middle ware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6l0by.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });

async function tripConnected() {
    try {
        await client.connect()
        console.log("Database connected".yellow.italic);

        const serviceCollection = client.db('Trip').collection('services')

        app.get('/homeServices', async (req, res) => {
            const cursor = serviceCollection.find({})
            const service = await cursor.limit(3).toArray()
            res.send(service)
        })

        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({})
            const service = await cursor.toArray()
            res.send(service)
        })

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })

    }
    finally {

    }


}

tripConnected()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`running prot ${port}`)
})