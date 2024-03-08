require("dotenv").config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');

const uri = `${process.env.MONGO_URI}`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);

async function fetchRandomQuote() {
    try {
        const collection = client.db("Weather").collection("Facts");
        const docCount = await collection.countDocuments();
        const index = Math.floor(Math.random() * docCount);
        const fact = await collection.findOne({}, { skip: index });
        return (fact);
    } catch (err) {
        console.error("Error:", err);
        throw err;
    }
}

const app = express();

app.get('/', async (req, res) => {
    try {
        const randomFact = await fetchRandomQuote();
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.json(randomFact);
        //console.log(randomFact);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ Error: "An error occurred" });
    }
});

app.get('*', async (req, res) => {
    try {
        res.send("Heyaa")
    }
    catch (err) {
        console.log("OOps")
    }
})

app.use(cors());

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("Server is running on port 3000");
});

module.export = app

/*async function insertData() {
    try {
        const collection = client.db("Weather").collection("Facts");

        const multipleInsertResult = await collection.insertMany([]);

        if (multipleInsertResult.acknowledged) {
            console.log('Inserted document ID:', multipleInsertResult.insertedIds);
        } else {
            console.log('Failed to insert document.');
        }
    }
    catch (error) {
        console.error("Error Inserting Data: ", error);
    }
    finally {
        await client.close();
    }
}
insertData().catch(console.error);*/


/*async function insertData() {
    try {
        const collection = client.db("Weather").collection("Facts");

        const multipleInsertResult = await collection.insertMany([]);

        if (multipleInsertResult.acknowledged) {
            console.log('Inserted document ID:', multipleInsertResult.insertedIds);
        } else {
            console.log('Failed to insert document.');
        }
    }
    catch (error) {
        console.error("Error Inserting Data: ", error);
    }
    finally {
        await client.close();
    }
}
insertData().catch(console.error);*/