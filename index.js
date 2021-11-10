const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();


/* Middleware */
app.use(cors());
app.use(express.json());


const port = process.env.PORT || 5000;


app.get('/', (req, res) =>{
    res.send('bike island server running');
})

app.listen(port, ()=> {
    console.log('bike island server at port ',port);
})