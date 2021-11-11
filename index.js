const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;



/* Middleware */
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a65gj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const database = client.db("bike-island");
const servicesCollection = database.collection("services");
const cyclesCollection = database.collection('cycles');







async function server(){
    try{
        await client.connect();

        //get services:
        app.get('/services', async(req, res) =>{
            const cursor = servicesCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        //get cycles:
        app.get('/cycles', async(req, res) =>{
            const cursor = cyclesCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        //post cycle:
        app.post('/cycles', async(req, res) =>{
            const product = req.body;
            const result = await cyclesCollection.insertOne(product);
            res.json(result);
        })
        //get cycle by id:
        app.get("/cycles/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await cyclesCollection.findOne(query);
            res.json(result);
          });
    }
    finally{
        // await client.close();
    }
}

server().catch(console.dir);



const port = process.env.PORT || 5000;


app.get('/', (req, res) =>{
    res.send('bike island server running');
})

app.listen(port, ()=> {
    console.log('bike island server at port ',port);
})