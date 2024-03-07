const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');

const uri = "mongodb+srv://Sashank:9K7olqq6OL7ktDLp@weather.i9eog8d.mongodb.net/?retryWrites=true&w=majority";
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
    } catch (err) {
        console.error("The error:", err);
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

app.use(cors());
/*app.listen(3000, () => {
    console.log("Server is running on port 3000");
});*/

module.exports = app()


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