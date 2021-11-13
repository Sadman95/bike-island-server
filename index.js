const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const { json } = require("express");

/* Middleware */
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a65gj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const database = client.db("bike-island");
const servicesCollection = database.collection("services");
const cyclesCollection = database.collection("cycles");
const usersCollection = database.collection("users");
const ordersCollection = database.collection("orders");
const reviewsCollection = database.collection("reviews");

async function server() {
  try {
    await client.connect();

    //get services:
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    //get cycles:
    app.get("/cycles", async (req, res) => {
      const cursor = cyclesCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    //post cycle:
    app.post("/cycles", async (req, res) => {
      const product = req.body;
      const result = await cyclesCollection.insertOne(product);
      res.json(result);
    });
    //get cycle by id:
    app.get("/cycles/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await cyclesCollection.findOne(query);
      res.json(result);
    });

    /* update cycle by id */
    app.put("/cycles/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateCycleDoc = {
        $set: {
          productTitle: req.body.name,
          productDesc: req.body.description,
          productPrice: req.body.price,
          productImg: req.body.image,
        },
      };
      const result = await cyclesCollection.updateOne(
        filter,
        updateCycleDoc,
        options
      );
      res.json(result);
    });

    //post user:
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });
    //post orders:
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.json(result);
    });
    //get users orders by email:
    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      const query = { userEmail: email };
      const cursor = ordersCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //delete order by user:
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    });
    //delete order by admin:
    app.delete("/allOrders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    });
    //get order status by user email and id:
    app.get('/orders/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {
            _id: ObjectId(id)
        }
        const result = await ordersCollection.findOne(query);
        res.send(result);
    })

    //order status update:
    app.put('/orders/:id', async(req, res)=>{
        const id = req.params.id;
        const filter = {_id: ObjectId(id)};
        const options = {upsert: true};
        const updateDoc = {
            $set: {
                status: 'Shipped'
            }
        }
        const result = await ordersCollection.updateOne(filter, updateDoc, options);
        res.json(result);
    })
    



    // post review:
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.json(result);
    });
    //get reviews:
    app.get("/reviews", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    //get all users:
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    //put user to make admin:
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.adminEmail };

      const options = { upsert: true };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    //admin check:
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.send({ admin: isAdmin });
    });
    //load all orders:
    app.get("/allOrders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}

server().catch(console.dir);

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("bike island server running");
});

app.listen(port, () => {
  console.log("bike island server at port ", port);
});
